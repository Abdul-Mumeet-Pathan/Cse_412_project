// file: D:\cse412\project\job_portal_rag\server\index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import the RAG route
const ragRoutes = require("./routes/rag");

const app = express();
app.use(cors());              // allow requests from React (localhost:3000)
app.use(express.json());      // parse JSON bodies

// Mount RAG under /api/rag
app.use("/api/rag", ragRoutes);

// (Optional) You can mount other API routes here, e.g., job CRUD, user auth, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});
