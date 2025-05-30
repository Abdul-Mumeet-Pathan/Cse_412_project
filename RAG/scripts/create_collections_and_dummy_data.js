// file: D:\cse412\project\job_portal_rag\scripts\create_collections_and_dummy_data.js

/**
 * This script will:
 *   1. Connect to your MongoDB Atlas cluster (via MONGODB_URI, DB_NAME in .env).
 *   2. Drop (if exist) and recreate the four main collections:
 *        - users
 *        - companies
 *        - jobs
 *        - applications
 *   3. Insert **15** sample documents into each collection, ensuring references align.
 *
 * Usage:
 *   1. Ensure you have a `.env` in this directory (or a parent) with:
 *        MONGODB_URI="your_connection_string"
 *        DB_NAME="job_portal_rag"
 *   2. In a terminal, from `D:\cse412\project\job_portal_rag\scripts`, run:
 *        npm install mongodb dotenv
 *        node create_collections_and_dummy_data.js
 */

require("dotenv").config(); // Loads environment variables from .env
const { MongoClient, ObjectId } = require("mongodb");

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "job_portal_rag";

  if (!uri) {
    console.error("⛔ ERROR: MONGODB_URI not set in .env");
    process.exit(1);
  }

  let client;
  try {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas.");

    const db = client.db(dbName);

    // -------------------------------------------------------------------
    // 1) Drop existing collections (if they exist), then recreate them.
    // -------------------------------------------------------------------
    const collectionsToReset = ["users", "companies", "jobs", "applications"];
    for (const name of collectionsToReset) {
      const colList = await db.listCollections({ name }).toArray();
      if (colList.length > 0) {
        await db.collection(name).drop();
        console.log(`ℹ️  Dropped existing collection '${name}'.`);
      }
      // The collection will be (re)created on first insert.
    }

    // --------------------------------
    // 2) Insert sample documents
    // --------------------------------

    // 2a) USERS collection → 15 dummy users
    const usersCol = db.collection("users");
    const userIds = [];
    for (let i = 1; i <= 15; i++) {
      const uid = new ObjectId();
      userIds.push(uid);
      const userDoc = {
        _id: uid,
        fullname: `User ${i}`,
        email: `user${i}@example.com`,
        phoneNumber: 1000000000 + i,
        password: `$2a$10$placeholderhash${i}`, // placeholder bcrypt hash
        role: i % 2 === 0 ? "recruiter" : "applicant", // alternate roles
        profile: {
          profilePhoto: `https://example.com/avatar${i}.png`,
          skills: i % 2 === 0 ? [] : [`SkillA${i}`, `SkillB${i}`],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
      await usersCol.insertOne(userDoc);
    }
    console.log(`✅ Inserted 15 users (IDs: ${userIds.map((id) => id.toHexString()).join(", ")})`);

    // 2b) COMPANIES collection → 15 dummy companies
    const companiesCol = db.collection("companies");
    const companyIds = [];
    for (let i = 1; i <= 15; i++) {
      const cid = new ObjectId();
      companyIds.push(cid);
      // assign each company to a “recruiter” user (even‐indexed in userIds list)
      const recruiterIndex = (i * 2 - 2) % userIds.length; // grabs userIds[0], userIds[2], ...
      const ownerUserId = userIds[recruiterIndex];
      const companyDoc = {
        _id: cid,
        name: `Company ${i}`,
        userId: ownerUserId, // recruiter user
        description: `Description for Company ${i}. We build solutions.`,
        location: i % 3 === 0 ? "Dhaka" : "Chittagong",
        logo: `https://example.com/company_logo${i}.png`,
        website: `https://company${i}.example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
      await companiesCol.insertOne(companyDoc);
    }
    console.log(`✅ Inserted 15 companies (IDs: ${companyIds.map((id) => id.toHexString()).join(", ")})`);

    // 2c) JOBS collection → 15 dummy jobs
    const jobsCol = db.collection("jobs");
    const jobIds = [];
    for (let i = 1; i <= 15; i++) {
      const jid = new ObjectId();
      jobIds.push(jid);
      // pick a random company for this job
      const compIndex = (i - 1) % companyIds.length; 
      const companyId = companyIds[compIndex];
      // pick the user who created this job as the recruiter of that company (lookup from companyDoc.userId)
      const companyDoc = await companiesCol.findOne({ _id: companyId });
      const createdByUser = companyDoc.userId;

      const jobDoc = {
        _id: jid,
        title: `Job Title ${i}`,
        description: `This is the description of Job ${i}. Responsibilities and details here.`,
        requirements: [`ReqA${i}`, `ReqB${i}`, `ReqC${i}`],
        salary: 20000 + i * 500,
        experienceLevel: (i % 5) + 1, // values between 1 and 5
        location: i % 2 === 0 ? "Dhaka" : "Chittagong",
        jobType: i % 3 === 0 ? "Part-time" : "Full-time",
        position: i, 
        company: companyId,
        created_by: createdByUser,
        applications: [], // will fill in next step
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
      await jobsCol.insertOne(jobDoc);
    }
    console.log(`✅ Inserted 15 jobs (IDs: ${jobIds.map((id) => id.toHexString()).join(", ")})`);

    // 2d) APPLICATIONS collection → 15 dummy applications
    const applicationsCol = db.collection("applications");
    const applicationIds = [];
    for (let i = 1; i <= 15; i++) {
      const aid = new ObjectId();
      applicationIds.push(aid);
      // Each application: pick job i, applicant = a random applicant user (odd‐indexed in userIds list)
      const jobId = jobIds[i - 1];
      // pick an applicant user (make sure role is "applicant")
      const applicantCandidates = userIds.filter((uid, idx) => idx % 2 === 0); // users at even‐indices have role "applicant"
      const applicantId = applicantCandidates[(i - 1) % applicantCandidates.length];

      const applicationDoc = {
        _id: aid,
        job: jobId,
        applicant: applicantId,
        status: i % 3 === 0 ? "accepted" : "pending", // alternate statuses
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
      await applicationsCol.insertOne(applicationDoc);

      // Also update the corresponding job’s `applications` array:
      await jobsCol.updateOne(
        { _id: jobId },
        { $push: { applications: aid } }
      );
    }
    console.log(`✅ Inserted 15 applications (IDs: ${applicationIds.map((id) => id.toHexString()).join(", ")})`);

    // --------------------------------
    // 3) Summary of inserted dummy data
    // --------------------------------
    console.log("\n🎉 Dummy data population complete!");
    console.log(`   • Total users:    15 (IDs: ${userIds.map((u) => u.toHexString()).join(", ")})`);
    console.log(`   • Total companies:15 (IDs: ${companyIds.map((c) => c.toHexString()).join(", ")})`);
    console.log(`   • Total jobs:     15 (IDs: ${jobIds.map((j) => j.toHexString()).join(", ")})`);
    console.log(`   • Total apps:     15 (IDs: ${applicationIds.map((a) => a.toHexString()).join(", ")})\n`);

  } catch (err) {
    console.error("⛔ ERROR in create_collections_and_dummy_data.js:", err);
  } finally {
    if (client) await client.close();
    process.exit(0);
  }
}

main();



// ********************************************************************************************************

// // file: D:\cse412\project\job_portal_rag\scripts\create_collections_and_dummy_data.js

// /**
//  * This script will:
//  *   1. Connect to your MongoDB Atlas cluster (via MONGODB_URI, DB_NAME in .env).
//  *   2. Drop (if exist) and recreate the four main collections:
//  *        - users
//  *        - companies
//  *        - jobs
//  *        - applications
//  *   3. Insert one or two sample documents into each collection, ensuring references align.
//  *
//  * Usage:
//  *   1. Ensure you have a `.env` in this directory (or a parent) with:
//  *        MONGODB_URI="your_connection_string"
//  *        DB_NAME="job_portal_rag"
//  *   2. In a terminal, from `D:\cse412\project\job_portal_rag\scripts`, run:
//  *        npm install mongodb dotenv
//  *        node create_collections_and_dummy_data.js
//  */

// require("dotenv").config(); // Loads .env
// const { MongoClient, ObjectId } = require("mongodb");

// async function main() {
//   const uri = process.env.MONGODB_URI;
//   const dbName = process.env.DB_NAME || "job_portal_rag";

//   if (!uri) {
//     console.error("⛔ ERROR: MONGODB_URI not set in .env");
//     process.exit(1);
//   }

//   let client;
//   try {
//     client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     await client.connect();
//     console.log("✅ Connected to MongoDB Atlas.");

//     const db = client.db(dbName);

//     // -------------------------------------------------------------------
//     // 1) Drop existing collections (if they exist), then recreate them.
//     // -------------------------------------------------------------------
//     const collectionsToReset = ["users", "companies", "jobs", "applications"];
//     for (const name of collectionsToReset) {
//       const colList = await db.listCollections({ name }).toArray();
//       if (colList.length > 0) {
//         await db.collection(name).drop();
//         console.log(`ℹ️  Dropped existing collection '${name}'.`);
//       }
//       // The collection will be (re)created on first insert.
//     }

//     // --------------------------------
//     // 2) Insert sample documents
//     // --------------------------------

//     // 2a) USERS collection
//     const usersCol = db.collection("users");

//     // Sample “applicant” user
//     const aliceId = new ObjectId();
//     const alice = {
//       _id: aliceId,
//       fullname: "Alice Example",
//       email: "alice@example.com",
//       phoneNumber: 1234567890,
//       password: "$2a$10$placeholderhash1", // placeholder
//       role: "applicant",
//       profile: {
//         profilePhoto: "https://example.com/alice.png",
//         skills: ["JavaScript", "React"]
//       },
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     // Sample “recruiter” user
//     const bobId = new ObjectId();
//     const bob = {
//       _id: bobId,
//       fullname: "Bob Recruiter",
//       email: "bob@corp.com",
//       phoneNumber: 9876543210,
//       password: "$2a$10$placeholderhash2", // placeholder
//       role: "recruiter",
//       profile: {
//         profilePhoto: "https://example.com/bob.png",
//         skills: []
//       },
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     await usersCol.insertMany([alice, bob]);
//     console.log(`✅ Inserted 2 users: ${aliceId.toHexString()}, ${bobId.toHexString()}`);

//     // 2b) COMPANIES collection
//     const companiesCol = db.collection("companies");
//     const exampleCorpId = new ObjectId();
//     const exampleCorp = {
//       _id: exampleCorpId,
//       name: "Example Corp",
//       userId: bobId, // Bob is the owner
//       description: "We build web applications.",
//       location: "Dhaka",
//       logo: "https://example.com/logo.png",
//       website: "https://example.com",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     await companiesCol.insertOne(exampleCorp);
//     console.log(`✅ Inserted company: ${exampleCorpId.toHexString()}`);

//     // 2c) JOBS collection
//     const jobsCol = db.collection("jobs");

//     // Sample job #1 (posted by Bob at Example Corp)
//     const job1Id = new ObjectId();
//     const job1 = {
//       _id: job1Id,
//       title: "Junior Frontend Developer",
//       description:
//         "Build and maintain React-based frontend applications under supervision. Collaborate with backend team.",
//       requirements: ["JavaScript", "React", "HTML", "CSS"],
//       salary: 25000,
//       experienceLevel: 1, // entry-level
//       location: "Dhaka",
//       jobType: "Full-time",
//       position: 1, // arbitrary code
//       company: exampleCorpId,
//       created_by: bobId,
//       applications: [], // to be filled later
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     // Sample job #2 (another role)
//     const job2Id = new ObjectId();
//     const job2 = {
//       _id: job2Id,
//       title: "Backend Engineer (Node.js)",
//       description:
//         "Build RESTful APIs using Node.js and Express. Optimize MongoDB queries and collaborate with frontend.",
//       requirements: ["Node.js", "Express", "MongoDB", "REST"],
//       salary: 40000,
//       experienceLevel: 2, // mid-level
//       location: "Dhaka",
//       jobType: "Full-time",
//       position: 2,
//       company: exampleCorpId,
//       created_by: bobId,
//       applications: [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     await jobsCol.insertMany([job1, job2]);
//     console.log(`✅ Inserted 2 jobs: ${job1Id.toHexString()}, ${job2Id.toHexString()}`);

//     // 2d) APPLICATIONS collection
//     const applicationsCol = db.collection("applications");

//     // Alice applies to Job #1
//     const app1Id = new ObjectId();
//     const application1 = {
//       _id: app1Id,
//       job: job1Id,
//       applicant: aliceId,
//       status: "pending",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     // Alice also applies to Job #2
//     const app2Id = new ObjectId();
//     const application2 = {
//       _id: app2Id,
//       job: job2Id,
//       applicant: aliceId,
//       status: "pending",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       __v: 0
//     };

//     await applicationsCol.insertMany([application1, application2]);
//     console.log(`✅ Inserted 2 applications: ${app1Id.toHexString()}, ${app2Id.toHexString()}`);

//     // 2e) Update each job’s `applications` array
//     await jobsCol.updateOne(
//       { _id: job1Id },
//       { $set: { applications: [app1Id] } }
//     );
//     await jobsCol.updateOne(
//       { _id: job2Id },
//       { $set: { applications: [app2Id] } }
//     );
//     console.log(
//       `ℹ️  Updated job ${job1Id.toHexString()} → applications [${app1Id.toHexString()}];\n` +
//       `   Updated job ${job2Id.toHexString()} → applications [${app2Id.toHexString()}]`
//     );

//     console.log("\n🎉 Dummy data population complete!");
//     console.log("   • users:", aliceId.toHexString(), "(applicant),", bobId.toHexString(), "(recruiter)");
//     console.log("   • company:", exampleCorpId.toHexString());
//     console.log("   • jobs:", job1Id.toHexString(), job2Id.toHexString());
//     console.log("   • applications:", app1Id.toHexString(), app2Id.toHexString());
//   } catch (err) {
//     console.error("⛔ ERROR in create_collections_and_dummy_data.js:", err);
//   } finally {
//     if (client) await client.close();
//     process.exit(0);
//   }
// }

// main();
