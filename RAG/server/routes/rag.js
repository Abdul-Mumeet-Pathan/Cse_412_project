// server/routes/rag.js
const express        = require("express");
const router         = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const { getEmbedding }         = require("../embeddingService");
const { generateAnswer }       = require("../llmService");
require("dotenv").config();

const MONGODB_URI            = process.env.MONGODB_URI;
const ATLAS_SEARCH_INDEX     = "test_search_indecies"; // your Search index name

if (!MONGODB_URI) {
  console.error("⛔ MONGODB_URI not set in .env");
  process.exit(1);
}

let knowledgeCol = null;

(async () => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    // **IMPORTANT**: we explicitly open "test" here—
    //     read from test.jobs, write to test.knowledge_docs
    const db = client.db("test");
    knowledgeCol = db.collection("knowledge_docs");
    console.log("✅ Connected to test.knowledge_docs collection.");
  } catch (err) {
    console.error("⛔ Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  }
})();

// A helper to convert range‐filters like { $lte: 2 } into MQL
function convertMqlRangeCondition(condition) {
  const mql = {};
  if (condition.$lte !== undefined) mql.$lte = condition.$lte;
  if (condition.$lt  !== undefined) mql.$lt  = condition.$lt;
  if (condition.$gte !== undefined) mql.$gte = condition.$gte;
  if (condition.$gt  !== undefined) mql.$gt  = condition.$gt;
  if (Object.keys(mql).length === 0) {
    throw new Error(`Invalid range condition: ${JSON.stringify(condition)}`);
  }
  return mql;
}

/**
 * POST /api/rag/query
 * Body: { query: "string", filters: {...}, topK: 5 }
 */
router.post("/query", async (req, res) => {
  try {
    const { query, filters = {}, topK = 1 } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ success: false, error: "Query must be a non-empty string." });
    }
    if (typeof topK !== "number" || topK <= 0) {
      return res.status(400).json({ success: false, error: "topK must be a positive integer." });
    }

    // 1) Compute embedding for the user query
    let qEmbedding = await getEmbedding(query);
    if (
      typeof qEmbedding === "object" &&
      qEmbedding !== null &&
      !Array.isArray(qEmbedding) &&
      typeof qEmbedding.length === "number"
    ) {
      qEmbedding = Array.from(qEmbedding);
    }
    if (!Array.isArray(qEmbedding) || !qEmbedding.every((v) => typeof v === "number")) {
      throw new Error("Embedding must be a numeric array");
    }

    // 2) Build the $vectorSearch stage (always operating on test.knowledge_docs)
    const vectorSearchStage = {
      $vectorSearch: {
        index:  ATLAS_SEARCH_INDEX,
        path:   "embedding",
        queryVector: qEmbedding,
        numCandidates: Math.max(150, topK * 10),
        limit: topK
      }
    };

    // 3) If filters exist, convert them into a MongoDB $and array
    if (Object.keys(filters).length > 0) {
      const andClauses = [];
      for (const field in filters) {
        const cond = filters[field];

        if (field === "companyId") {
          // Treat companyId as an ObjectId
          if (typeof cond === "string" && ObjectId.isValid(cond)) {
            andClauses.push({ "metadata.companyId": new ObjectId(cond) });
          } else {
            return res.status(400).json({
              success: false,
              error: "Invalid ObjectId for companyId"
            });
          }
        } else if (typeof cond === "object" && cond !== null) {
          // e.g. { $lte: 2 }
          let mqlRange;
          try {
            mqlRange = convertMqlRangeCondition(cond);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: `Invalid filter for '${field}': ${e.message}`
            });
          }
          andClauses.push({ [`metadata.${field}`]: mqlRange });
        } else {
          // e.g. { location: "Dhaka" }
          andClauses.push({ [`metadata.${field}`]: cond });
        }
      }
      vectorSearchStage.$vectorSearch.filter = { $and: andClauses };
    }

    // 4) Project only the fields we care about
    const projectStage = {
      $project: {
        _id: 0,
        text: 1,
        metadata: 1,
        score: { $meta: "searchScore" }
      }
    };

    const pipeline = [vectorSearchStage, projectStage];

    // 5) Run the aggregation against test.knowledge_docs
    const results = await knowledgeCol.aggregate(pipeline).toArray();

    // 6) Collect the “text” of each matched snippet
    const snippets = results.map((doc) => doc.text);

    // 7) If no snippets, fallback message. Otherwise invoke the LLM
    let answer = "I’m sorry, I don’t see that information in the portal.";
    if (snippets.length > 0) {
      try {
        answer = await generateAnswer(snippets, query);
      } catch (llmErr) {
        console.error("⛔ Error generating answer from LLM:", llmErr);
        return res
          .status(500)
          .json({ success: false, error: "Failed to generate answer from LLM." });
      }
    }

    return res.json({ success: true, answer, sources: results });
  } catch (err) {
    console.error("⛔ Unhandled RAG pipeline error:", err);
    return res
      .status(500)
      .json({ success: false, error: "An unexpected RAG pipeline failure occurred." });
  }
});

module.exports = router;

//********************************************************************************** */

// // file: D:\cse412\project\job_portal_rag\server\routes\rag.js
// // version: 6.0.0 (production-ready, with optional filters & $vectorSearch)

// const express = require("express");
// const router = express.Router();
// const { MongoClient, ObjectId } = require("mongodb");
// const { getEmbedding } = require("../embeddingService");
// const { generateAnswer } = require("../llmService");
// require("dotenv").config();

// // ————————————————————————————————
// // 1) Environment / config
// // ————————————————————————————————
// const MONGODB_URI = process.env.MONGODB_URI;
// const DB_NAME = process.env.DB_NAME || "job_portal_rag";
// // MUST match your Atlas Search index name exactly:
// const ATLAS_SEARCH_INDEX_NAME = "test_search_indecies";

// if (!MONGODB_URI) {
//   console.error("⛔ CRITICAL: MONGODB_URI not set in .env");
//   process.exit(1);
// }

// /** @type {import('mongodb').Collection | null} */
// let knowledgeCol = null;

// // ————————————————————————————————
// // 2) Connect to MongoDB Atlas & cache the collection
// // ————————————————————————————————
// (async () => {
//   try {
//     const client = new MongoClient(MONGODB_URI);
//     await client.connect();
//     knowledgeCol = client.db(DB_NAME).collection("knowledge_docs");
//     console.log("✅ Connected to MongoDB Atlas and 'knowledge_docs' collection.");
//   } catch (err) {
//     console.error("⛔ Failed to connect to MongoDB Atlas:", err);
//     process.exit(1);
//   }
// })();

// /**
//  * Helper: Converts a range object like { $lte: 2 } into itself (but validates it).
//  * Throws if none of $lte/$lt/$gte/$gt are present.
//  */
// function convertMqlRangeCondition(condition) {
//   const mqlRange = {};
//   if (condition.$lte !== undefined) mqlRange.$lte = condition.$lte;
//   if (condition.$lt !== undefined) mqlRange.$lt = condition.$lt;
//   if (condition.$gte !== undefined) mqlRange.$gte = condition.$gte;
//   if (condition.$gt !== undefined) mqlRange.$gt = condition.$gt;

//   if (Object.keys(mqlRange).length === 0) {
//     throw new Error(`Invalid range: ${JSON.stringify(condition)}. ` +
//                     `Expected one of $lte, $lt, $gte, $gt.`);
//   }
//   return mqlRange;
// }

// /**
//  * POST /api/rag/query
//  *
//  * Request Body Example:
//  * {
//  *   "query": "Junior Frontend Developer jobs in Dhaka with less than 2 years experience",
//  *   "filters": {
//  *     "location": "Dhaka",
//  *     "experienceLevel": { "$lte": 2 },
//  *     "companyId": "651a84f3e6a0d4c885906f23"
//  *   },
//  *   "topK": 5
//  * }
//  *
//  * Response:
//  * {
//  *   "success": true,
//  *   "answer": "...",
//  *   "sources": [...]
//  * }
//  */
// router.post("/query", async (req, res) => {
//   try {
//     // 3) Parse & validate request
//     const { query, filters = {}, topK = 5 } = req.body;
//     if (typeof query !== "string" || !query.trim()) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Query must be a non-empty string." });
//     }
//     if (typeof topK !== "number" || topK <= 0) {
//       return res
//         .status(400)
//         .json({ success: false, error: "topK must be a positive number." });
//     }

//     // 4) Generate the query embedding
//     let queryEmbedding;
//     try {
//       queryEmbedding = await getEmbedding(query);
//     } catch (embErr) {
//       console.error("⛔ Error generating query embedding:", embErr);
//       return res
//         .status(500)
//         .json({ success: false, error: "Failed to generate query embedding." });
//     }

//     // 4a) If it’s a typed array (Float32Array), convert to number[]
//     if (
//       typeof queryEmbedding === "object" &&
//       queryEmbedding !== null &&
//       typeof queryEmbedding.length === "number" &&
//       !Array.isArray(queryEmbedding)
//     ) {
//       queryEmbedding = Array.from(queryEmbedding);
//     }

//     // 4b) Validate that it’s now a plain number array
//     if (
//       !Array.isArray(queryEmbedding) ||
//       !queryEmbedding.every((n) => typeof n === "number")
//     ) {
//       throw new Error("Generated embedding is not a numeric array");
//     }

//     // 5) Build the base $vectorSearch stage (no filters yet)
//     const vectorSearchStage = {
//       $vectorSearch: {
//         index: ATLAS_SEARCH_INDEX_NAME,
//         path: "embedding",
//         queryVector: queryEmbedding,
//         numCandidates: Math.max(150, parseInt(topK, 10) * 10),
//         limit: parseInt(topK, 10),
//       },
//     };

//     // 6) If filters exist, convert to valid $and clauses
//     if (Object.keys(filters).length > 0) {
//       const andClauses = [];

//       for (const field in filters) {
//         const condition = filters[field];

//         // 6a) If field is "companyId", convert string → ObjectId
//         if (field === "companyId") {
//           if (typeof condition === "string" && ObjectId.isValid(condition)) {
//             andClauses.push({ "metadata.companyId": new ObjectId(condition) });
//           } else {
//             return res
//               .status(400)
//               .json({ success: false, error: "Invalid ObjectId for 'companyId'." });
//           }

//         // 6b) If condition is an object with $lte/$gte/etc., keep it
//         } else if (
//           typeof condition === "object" &&
//           (condition.$lte !== undefined ||
//             condition.$lt !== undefined ||
//             condition.$gte !== undefined ||
//             condition.$gt !== undefined)
//         ) {
//           try {
//             const mqlRange = convertMqlRangeCondition(condition);
//             andClauses.push({ [`metadata.${field}`]: mqlRange });
//           } catch (err) {
//             return res
//               .status(400)
//               .json({ success: false, error: `Invalid range for '${field}': ${err.message}` });
//           }

//         // 6c) Otherwise treat as an exact match (string or number)
//         } else {
//           andClauses.push({ [`metadata.${field}`]: condition });
//         }
//       }

//       // Attach filter under $and
//       vectorSearchStage.$vectorSearch.filter = { $and: andClauses };
//     }

//     // 7) Project only the fields we need
//     const projectStage = {
//       $project: {
//         _id: 0,
//         text: 1,
//         metadata: 1,
//         score: { $meta: "searchScore" },
//       },
//     };

//     // 8) Final aggregation pipeline
//     const pipeline = [vectorSearchStage, projectStage];
//     // console.log("📊 Aggregation pipeline:", JSON.stringify(pipeline, null, 2));

//     // 9) Run the aggregation
//     const results = await knowledgeCol.aggregate(pipeline).toArray();

//     // 10) Extract snippet texts
//     const snippets = results.map((doc) => doc.text);

//     // 11) If we have any snippets, call the LLM; otherwise fallback
//     let answer = "I’m sorry, I don’t see that information in the portal.";
//     if (snippets.length > 0) {
//       try {
//         answer = await generateAnswer(snippets, query);
//       } catch (llmErr) {
//         console.error("⛔ Error generating answer from LLM:", llmErr);
//         return res
//           .status(500)
//           .json({ success: false, error: "Failed to generate answer from LLM." });
//       }
//     }

//     // 12) Return final JSON
//     return res.json({ success: true, answer, sources: results });
//   } catch (err) {
//     console.error("⛔ Unhandled RAG pipeline error:", err);
//     return res
//       .status(500)
//       .json({ success: false, error: "An unexpected RAG pipeline failure occurred." });
//   }
// });

// module.exports = router;
