// // file: frontend_chat/src/api.js

// import axios from 'axios';

// const BASE_URL = 'http://localhost:5000/api/rag';

// export async function postQuery(text) {
//   // Only one payload declaration—includes filters and topK
//   const payload = {
//     query: text,
//     filters: {
//       location: "aftabnagar",
//       experienceLevel: { $lte: 5 }
//     },
//     topK: 1
//   };

//   try {
//     const resp = await axios.post(`${BASE_URL}/query`, payload, {
//       headers: { 'Content-Type': 'application/json' },
//     });
//     return resp.data;
//   } catch (err) {
//     console.error('❌ postQuery error:', err);
//     throw err;
//   }
// }





// File: D:\cse412\project\job_portal_rag\frontend_chat\src\api.js
import axios from "axios";

// Replace with your actual RAG backend endpoint
const BASE_URL = "http://localhost:5000/api/rag/query"; 

export async function sendQueryToRAG(queryText, filters = {}, topK = 1) { 
  try {
    const payload = {
      query: queryText,
      filters: filters,
      topK: topK,
    }; 
    const response = await axios.post(BASE_URL, payload); 
    return response.data; // { success: boolean, answer: string, sources: [ … ] } 
  } catch (err) {
    console.error("API Error:", err.response || err.message || err); 
    throw err; 
  }
}