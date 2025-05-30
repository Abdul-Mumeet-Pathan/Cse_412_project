// file: D:\cse412\project\job_portal_rag\server\embeddingService.js

require("dotenv").config();
const { pipeline } = require("@huggingface/transformers");
const fetch = require("node-fetch");

let embedder = null;

/**
 * initEmbedder(): Fetches the ONNX model and caches the pipeline.
 * Called once at module load time so you see that “✅ Embedding pipeline initialized” log immediately.
 */
async function initEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        config: {
          fetch: (url, options = {}) => {
            return fetch(url, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${process.env.HF_HUB_TOKEN}`,
              },
            });
          },
        },
      }
    );
    console.log("✅ Embedding pipeline initialized (Xenova/all-MiniLM-L6-v2).");
  }
}

// Immediately kick off initialization (no need to await here)
initEmbedder().catch(err => {
  console.error("⛔ Failed to initialize Embedding pipeline:", err);
});

/**
 * getEmbedding(text: string) => Promise<number[]>
 * Returns a 384-dimensional embedding as a plain number[].
 */
async function getEmbedding(text) {
  if (typeof text !== "string" || !text.trim().length) {
    throw new Error("getEmbedding: text must be a non-empty string");
  }

  // By this point embedder is guaranteed to be ready (or an error was already logged)
  const result = await embedder(text, { pooling: "mean", normalize: true });
  const raw = result[0];
  return Array.isArray(raw) ? raw : Array.from(raw);
}

module.exports = { getEmbedding };
