# file: D:\cse412\project\job_portal_rag\scripts\prepare_knowledge_docs.py

"""
Embedding Script for RAG (modified to always use the 'test' database):

  - Reads each job from the 'test.jobs' collection.
  - Constructs a text snippet (title + description + requirements + location).
  - If the snippet is >1000 chars, splits it into ~800‐char chunks.
  - Uses 'sentence-transformers/all-MiniLM-L6-v2' to compute a 384‐dim embedding for each snippet.
  - Upserts each snippet into 'test.knowledge_docs' with fields:
      {
        sourceType: "job",
        sourceId: ObjectId(<job_id>),
        chunkIndex: <0 or higher if chunked>,
        text: "<the snippet>",
        metadata: {
          jobId, companyId, experienceLevel, location, postedDate
        },
        embedding: [ ... 384 floats ... ]
      }
  - Requires: pymongo, sentence-transformers, python-dotenv
"""

from dotenv import load_dotenv
load_dotenv()  # loads MONGODB_URI from .env (DB_NAME is no longer used here)

import os
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from sentence_transformers import SentenceTransformer

# 1) Load MongoDB URI from environment
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("⛔ Please set MONGODB_URI in your .env file (e.g., mongodb+srv://...).")

# 2) Connect to MongoDB Atlas
client = MongoClient(MONGODB_URI)

# 3) Hard‐code the 'test' database here:
source_db      = client["test"]              # ← always read from `test.jobs`
destination_db = client["test"]              # ← always write into `test.knowledge_docs`

jobs_col      = source_db["jobs"]
knowledge_col = destination_db["knowledge_docs"]

# 4) Load the Hugging Face embedding model
print("⏳ Loading embedding model 'all-MiniLM-L6-v2' …")
model = SentenceTransformer("all-MiniLM-L6-v2")  # 384‐dim embeddings

# 5) Helper: split text into ~800‐char chunks (preserving sentence boundaries)
def chunk_text(text: str, max_chars: int = 800):
    sentences = text.replace("\n", " ").split(". ")
    chunks = []
    current = ""
    for sent in sentences:
        # +2 accounts for the ". " we removed when splitting
        if len(current) + len(sent) + 2 < max_chars:
            current += sent + ". "
        else:
            chunks.append(current.strip())
            current = sent + ". "
    if current:
        chunks.append(current.strip())
    return chunks

# 6) Iterate over every job document and upsert snippet embeddings
print("⏳ Processing jobs for embedding …")
count = 0

for job in jobs_col.find({}):
    # 6a) Extract fields from each job document
    job_id             = job["_id"]
    title              = job.get("title", "")
    description        = job.get("description", "")
    requirements       = job.get("requirements", [])
    requirements_text  = ", ".join(requirements) if isinstance(requirements, list) else str(requirements)
    location           = job.get("location", "")
    exp_level          = job.get("experienceLevel", 0)
    company_field      = job.get("company")
    posted_date_field  = job.get("createdAt")

    # 6b) Ensure companyId is an ObjectId (some snapshots store it as {"$oid": "..."}):
    company_id = None
    if isinstance(company_field, ObjectId):
        company_id = company_field
    elif isinstance(company_field, dict) and "$oid" in company_field:
        company_id = ObjectId(company_field["$oid"])

    # 6c) Convert posted_date to Python datetime if needed:
    posted_date = None
    if isinstance(posted_date_field, datetime):
        posted_date = posted_date_field
    elif isinstance(posted_date_field, dict) and "$date" in posted_date_field:
        # Example: {"$date":"2025-05-09T17:49:21.375Z"}
        iso_str = posted_date_field["$date"]
        posted_date = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))

    # 6d) Build the full snippet string
    full_snippet = f"{title} — {description} Requirements: {requirements_text}. Location: {location}."

    # 6e) If snippet is too long, split it into ~800‐char chunks
    snippets = [full_snippet]
    if len(full_snippet) > 1000:
        combined = f"{description} Requirements: {requirements_text}"
        raw_chunks = chunk_text(combined, max_chars=800)
        snippets = [f"{title} — {chunk} Location: {location}." for chunk in raw_chunks]

    # 6f) For each chunk, compute embedding and upsert into 'knowledge_docs'
    for idx, snippet in enumerate(snippets):
        print(f"🧠 Embedding job \"{title}\" (ID: {job_id}) — chunk {idx}")
        vector = model.encode(snippet).tolist()

        metadata = {
            "jobId":           job_id,
            "companyId":       company_id,
            "experienceLevel": exp_level,
            "location":        location,
            "postedDate":      posted_date
        }

        knowledge_col.update_one(
            {
                "sourceType": "job",
                "sourceId":   job_id,
                "chunkIndex": idx
            },
            {
                "$set": {
                    "text":      snippet,
                    "metadata":  metadata,
                    "embedding": vector
                }
            },
            upsert=True
        )
        count += 1

print(f"✅ Processed {count} job snippet(s) → embeddings stored in 'test.knowledge_docs'.")



# ***************************************************************************
# # file: D:\cse412\project\job_portal_rag\scripts\prepare_knowledge_docs.py

# """
# Embedding Script for RAG:

#   - Reads each job from the 'job' collection (not 'jobs').
#   - Constructs a text snippet (title + description + requirements + location).
#   - If the snippet is >1000 chars, splits it into ~800‐char chunks.
#   - Uses 'sentence-transformers/all-MiniLM-L6-v2' to compute a 384‐dim embedding for each snippet.
#   - Upserts each snippet into a new 'knowledge_docs' collection with fields:
#       {
#         sourceType: "job",
#         sourceId: ObjectId(<job_id>),
#         chunkIndex: <0 or higher if chunked>,
#         text: "<the snippet>",
#         metadata: {
#           jobId, companyId, experienceLevel, location, postedDate
#         },
#         embedding: [ ... 384 floats ... ]
#       }
#   - Requires: pymongo, sentence-transformers, python-dotenv
# """

# from dotenv import load_dotenv
# load_dotenv()  # loads MONGODB_URI and DB_NAME from .env

# import os
# from pymongo import MongoClient
# from bson import ObjectId
# from datetime import datetime
# from sentence_transformers import SentenceTransformer

# # 1) Load MongoDB settings from environment
# MONGODB_URI = os.getenv("MONGODB_URI")
# DB_NAME = os.getenv("DB_NAME", "test")

# if not MONGODB_URI:
#     raise ValueError("⛔ Please set MONGODB_URI in your .env file (e.g., mongodb+srv://...).")

# # 2) Connect to MongoDB Atlas
# client = MongoClient(MONGODB_URI)
# db = client[DB_NAME]
# jobs_col = db["jobs"]              # ← collection is named "job"
# knowledge_col = db["knowledge_docs"]

# # 3) Load the Hugging Face embedding model
# print("⏳ Loading embedding model 'all-MiniLM-L6-v2' …")
# model = SentenceTransformer("all-MiniLM-L6-v2")  # 384‐dim embeddings

# # 4) Helper: split long text into ~800-char chunks (preserving sentence boundaries)
# def chunk_text(text: str, max_chars: int = 800):
#     sentences = text.replace("\n", " ").split(". ")
#     chunks = []
#     current = ""
#     for sent in sentences:
#         # +2 for the period and space we removed during split
#         if len(current) + len(sent) + 2 < max_chars:
#             current += sent + ". "
#         else:
#             chunks.append(current.strip())
#             current = sent + ". "
#     if current:
#         chunks.append(current.strip())
#     return chunks

# # 5) Iterate over every job document and upsert snippet embeddings
# print("⏳ Processing jobs for embedding …")
# count = 0

# for job in jobs_col.find({}):
#     # 5a) Extract fields from each job
#     job_id = job["_id"]
#     title = job.get("title", "")
#     description = job.get("description", "")
#     requirements = job.get("requirements", [])
#     requirements_text = ", ".join(requirements) if isinstance(requirements, list) else str(requirements)
#     location = job.get("location", "")
#     exp_level = job.get("experienceLevel", 0)
#     company_field = job.get("company")
#     created_by_field = job.get("created_by")
#     posted_date_field = job.get("createdAt")

#     # 5b) Ensure companyId is an ObjectId (if stored as {"$oid": "..."})
#     company_id = None
#     if isinstance(company_field, ObjectId):
#         company_id = company_field
#     elif isinstance(company_field, dict) and "$oid" in company_field:
#         company_id = ObjectId(company_field["$oid"])
#     # else: leave as None or skip if invalid

#     # 5c) Convert posted_date to Python datetime if necessary
#     posted_date = None
#     if isinstance(posted_date_field, datetime):
#         posted_date = posted_date_field
#     elif isinstance(posted_date_field, dict) and "$date" in posted_date_field:
#         # Example format: {"$date":"2025-05-09T17:49:21.375Z"}
#         iso_str = posted_date_field["$date"]
#         # replace trailing 'Z' with '+00:00' so fromisoformat parses as UTC
#         posted_date = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
#     else:
#         posted_date = None

#     # 5d) Construct full snippet
#     full_snippet = f"{title} — {description} Requirements: {requirements_text}. Location: {location}."

#     # 5e) If too long, chunk into ~800‐char pieces
#     snippets = [full_snippet]
#     if len(full_snippet) > 1000:
#         combined = f"{description} Requirements: {requirements_text}"
#         raw_chunks = chunk_text(combined, max_chars=800)
#         snippets = [f"{title} — {chunk} Location: {location}." for chunk in raw_chunks]

#     # 5f) For each chunk, compute embedding and upsert into knowledge_docs
#     for idx, snippet in enumerate(snippets):
#         print(f"🧠 Embedding job: {title} ({str(job_id)}) — chunk {idx}")
#         vector = model.encode(snippet).tolist()  # returns numpy array, convert to list

#         metadata = {
#             "jobId": job_id,
#             "companyId": company_id,
#             "experienceLevel": exp_level,
#             "location": location,
#             "postedDate": posted_date
#         }

#         knowledge_col.update_one(
#             {
#                 "sourceType": "job",
#                 "sourceId": job_id,
#                 "chunkIndex": idx
#             },
#             {
#                 "$set": {
#                     "text": snippet,
#                     "metadata": metadata,
#                     "embedding": vector
#                 }
#             },
#             upsert=True
#         )
#         count += 1

# print(f"✅ Processed {count} job snippet(s) → embeddings stored in 'knowledge_docs'.")



# ****************************************************************************************

# # file: scripts/prepare_knowledge_docs.py

# """
# Embedding Script for RAG:
#   - Reads each job from the configured collection (default: 'job').
#   - Constructs a text snippet (title + description + requirements + location).
#   - Splits into ~800-char chunks if longer than 1,000 chars.
#   - Uses the 'sentence-transformers/all-MiniLM-L6-v2' model for 384-dim embeddings.
#   - Upserts each snippet into the 'knowledge_docs' collection.
#   - Configurable via environment:
#       MONGODB_URI        – your Atlas connection string
#       DB_NAME            – your database name (e.g. 'test')
#       JOB_COLLECTION     – your source jobs collection (e.g. 'job')
#       KNOWLEDGE_COLLECTION – target collection (e.g. 'knowledge_docs')
# """

# import os
# from dotenv import load_dotenv
# from pymongo import MongoClient
# from sentence_transformers import SentenceTransformer

# # 1) Load environment
# load_dotenv()  
# MONGODB_URI        = os.getenv("MONGODB_URI")
# DB_NAME            = os.getenv("DB_NAME")
# JOB_COLLECTION     = os.getenv("JOB_COLLECTION")
# KNOWLEDGE_COLLECTION = os.getenv("KNOWLEDGE_COLLECTION")

# if not MONGODB_URI:
#     raise ValueError("Please set MONGODB_URI in your .env")  

# # 2) Connect to MongoDB Atlas
# client      = MongoClient(MONGODB_URI)
# db          = client[DB_NAME]
# jobs_col    = db[JOB_COLLECTION]
# knowledge_col = db[KNOWLEDGE_COLLECTION]

# # 3) Load embedding model
# print("Loading embedding model ‘all-MiniLM-L6-v2’ …")
# model = SentenceTransformer("all-MiniLM-L6-v2")

# # 4) Helper: split long text into ~800-char chunks
# def chunk_text(text: str, max_chars: int = 800):
#     sentences = text.replace("\n", " ").split(". ")
#     chunks, current = [], ""
#     for sent in sentences:
#         if len(current) + len(sent) + 2 < max_chars:
#             current += sent + ". "
#         else:
#             chunks.append(current.strip())
#             current = sent + ". "
#     if current:
#         chunks.append(current.strip())
#     return chunks

# # 5) Process each job
# print("Processing jobs for embeddings…")
# count = 0
# for job in jobs_col.find({}):
#     count += 1
#     job_id       = job["_id"]
#     title        = job.get("title", "")
#     description  = job.get("description", "")
#     requirements = job.get("requirements", [])
#     req_text     = ", ".join(requirements) if isinstance(requirements, list) else str(requirements)
#     location     = job.get("location", "")
#     exp_level    = job.get("experienceLevel", 0)
#     company_id   = job.get("company")
#     posted_date  = job.get("createdAt")

#     # 5a) Build the full snippet
#     base_snippet = f"{title} — {description} Requirements: {req_text}. Location: {location}."
#     snippets     = [base_snippet]

#     # 5b) Chunk if too long
#     if len(base_snippet) > 1000:
#         raw_chunks = chunk_text(f"{description} Requirements: {req_text}", 800)
#         snippets   = [f"{title} — {chunk} Location: {location}." for chunk in raw_chunks]

#     # 5c) Embed + upsert each chunk
#     for idx, txt in enumerate(snippets):
#         vector = model.encode(txt).tolist()
#         metadata = {
#             "jobId": job_id,
#             "companyId": company_id,
#             "experienceLevel": exp_level,
#             "location": location,
#             "postedDate": posted_date
#         }
#         knowledge_col.update_one(
#             {"sourceType": "job", "sourceId": job_id, "chunkIndex": idx},
#             {"$set": {"text": txt, "metadata": metadata, "embedding": vector}},
#             upsert=True
#         )

# print(f"Processed {count} jobs → embeddings stored in '{KNOWLEDGE_COLLECTION}'.")





# *********************************************************************************************

# # file: D:\cse412\project\job_portal_rag\scripts\prepare_knowledge_docs.py

# """
# Embedding Script for RAG:
#   - Reads each job from the 'jobs' collection.
#   - Constructs a text snippet (title + description + requirements + location).
#   - If the snippet is >1000 chars, splits it into ~800-char chunks.
#   - Uses 'sentence-transformers/all-MiniLM-L6-v2' to compute a 384-dim embedding for each snippet.
#   - Upserts each snippet into a new 'knowledge_docs' collection with fields:
#       {
#         sourceType: "job",
#         sourceId: <job_id>,
#         chunkIndex: <0 or higher if chunked>,
#         text: "<the snippet>",
#         metadata: {
#           jobId, companyId, experienceLevel, location, postedDate
#         },
#         embedding: [ ... 384 floats ... ]
#       }
#   - Requires: pymongo, sentence-transformers, python-dotenv
# """

# from dotenv import load_dotenv
# load_dotenv()  # reads .env from cwd or parent directories

# import os
# from pymongo import MongoClient
# from sentence_transformers import SentenceTransformer

# # 1) Load MongoDB settings from environment
# MONGODB_URI = os.getenv("MONGODB_URI")
# DB_NAME = os.getenv("DB_NAME", "test")

# if not MONGODB_URI:
#     raise ValueError("⛔ Please set MONGODB_URI in your .env file (e.g., mongodb+srv://...).")

# # 2) Connect to MongoDB Atlas
# client = MongoClient(MONGODB_URI)
# db = client.get_database(DB_NAME)
# jobs_col = db["jobs"]
# knowledge_col = db["knowledge_docs"]

# # 3) Load the Hugging Face embedding model
# print("⏳ Loading embedding model ‘all-MiniLM-L6-v2’ …")
# model = SentenceTransformer("all-MiniLM-L6-v2")  # 384-dim embeddings

# # 4) Helper: split long text into ~800-char chunks (preserving sentence boundaries)
# def chunk_text(text: str, max_chars: int = 800):
#     sentences = text.replace("\n", " ").split(". ")
#     chunks = []
#     current = ""
#     for sent in sentences:
#         # +2 for the period and space we just removed from split
#         if len(current) + len(sent) + 2 < max_chars:
#             current += sent + ". "
#         else:
#             chunks.append(current.strip())
#             current = sent + ". "
#     if current:
#         chunks.append(current.strip())
#     return chunks

# # 5) Iterate over every job document and upsert snippet embeddings
# print("⏳ Processing jobs for embedding …")
# for job in jobs_col.find({}):
#     job_id = job["_id"]
#     title = job.get("title", "")
#     description = job.get("description", "")
#     requirements = job.get("requirements", [])
#     requirements_text = ", ".join(requirements) if isinstance(requirements, list) else str(requirements)
#     location = job.get("location", "")
#     exp_level = job.get("experienceLevel", 0)
#     company_id = job.get("company")
#     posted_date = job.get("createdAt")

#     # 5a) Combine into one string snippet
#     full_snippet = f"{title} — {description} Requirements: {requirements_text}. Location: {location}."

#     # 5b) If too long, chunk into ~800-char pieces
#     snippets = [full_snippet]
#     if len(full_snippet) > 1000:
#         combined = f"{description} Requirements: {requirements_text}"
#         raw_chunks = chunk_text(combined, max_chars=800)
#         snippets = [f"{title} — {chunk} Location: {location}." for chunk in raw_chunks]

#     # 5c) For each chunk, compute embedding and upsert into knowledge_docs
#     for idx, snippet in enumerate(snippets):
#         # Compute embedding (returns a numpy array of floats; convert to list)
#         vector = model.encode(snippet).tolist()

#         metadata = {
#             "jobId": job_id,
#             "companyId": company_id,
#             "experienceLevel": exp_level,
#             "location": location,
#             "postedDate": posted_date
#         }

#         # Upsert into knowledge_docs
#         knowledge_col.update_one(
#             {
#                 "sourceType": "job",
#                 "sourceId": job_id,
#                 "chunkIndex": idx
#             },
#             {
#                 "$set": {
#                     "text": snippet,
#                     "metadata": metadata,
#                     "embedding": vector
#                 }
#             },
#             upsert=True
#         )

# print("✅ All job snippets processed and embeddings stored in 'knowledge_docs'.")
