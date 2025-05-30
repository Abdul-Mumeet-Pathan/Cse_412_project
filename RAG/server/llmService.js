// file: D:\cse412\project\job_portal_rag\server\llmService.js
// version: 6.1.0 — now catches any HF HTTP error and returns a safe fallback

require("dotenv").config();
const axios = require("axios");

const HF_API_TOKEN = process.env.HF_API_TOKEN;
if (!HF_API_TOKEN) {
  console.error("⛔ HF_API_TOKEN not set in .env – LLM generation will fallback.");
  // We do NOT exit here; instead, allow generateAnswer to return a fallback.
}



// function formatPrompt(contexts, question) {
//   const instruction = "Answer the question based ONLY on the context. If not answerable, say so.\n\n";
//   const contextBlock = contexts.map((text, i) => `(${i + 1}) ${text}`).join("\n");
//   return `${instruction}Context:\n${contextBlock}\n\nQuestion: ${question}\nAnswer:`;
// }


/**
 * formatPrompt(contexts: string[], question: string) => string
 *   Numbers each snippet, then appends the question and "Answer:".
 */
function formatPrompt(contexts, question) {
  const instruction =
    "You are an AI assistant for a Job Portal. " +
    "Use ONLY the provided context to answer the user’s question. " +
    "If not available, list all the available jobs.\".\n\n";

  const numbered = contexts
    .map((txt, idx) => `(${idx + 1}) ${txt}`)
    .join("\n");
  const contextBlock = `Context:\n${numbered}\n\n`;
  const questionBlock = `Question: ${question}\n\nAnswer:`;
  return instruction + contextBlock + questionBlock;
}

/**
 * generateAnswer(contexts: string[], question: string): Promise<string>
 *   Calls the Hugging Face Inference API using a hosted model (distilgpt2 by default).
 *   If any HTTP error occurs, logs it and returns a safe fallback string.
 */
async function generateAnswer(contexts, question) {
  // 1) Basic validation
  if (!Array.isArray(contexts) || contexts.some((c) => typeof c !== "string")) {
    throw new Error("generateAnswer: contexts must be an array of strings");
  }
  if (!question || typeof question !== "string") {
    throw new Error("generateAnswer: question must be a non-empty string");
  }

  // 2) Build the prompt
  const prompt = formatPrompt(contexts, question);

  // 3) Prepare payload
  const payload = {
    inputs: prompt,
    parameters: { max_new_tokens: 100, do_sample: false },
  };

  // 4) If the HF_API_TOKEN is missing, immediately return fallback
  if (!HF_API_TOKEN) {
    console.warn(
      "⚠️ HF_API_TOKEN is not set. Skipping LLM call and returning fallback answer."
    );
    return "I’m sorry, I don’t see that information in the portal.";
  }

  // 5) Choose a well-known, always-hosted model slug    <<< --------------------------- CHOOSE MODEL

  //const MODEL_SLUG = "distilgpt2";
  //const MODEL_SLUG = "gpt2";
  //const MODEL_SLUG = "google/flan-t5-base";
  //const MODEL_SLUG = "deepseek-ai/DeepSeek-R1-0528";
  const MODEL_SLUG = "meta-llama/Llama-3.3-70B-Instruct";

  const url = `https://api-inference.huggingface.co/models/${MODEL_SLUG}`;

  try {
    // 6) Call the Inference API
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 120_000,
    });

    // 7) Extract generated_text
    let generated = "";
    if (Array.isArray(response.data) && response.data.length > 0) {
      generated = response.data[0].generated_text || "";
    } else if (response.data.generated_text) {
      generated = response.data.generated_text;
    } else {
      console.error(
        "Unexpected response format from HF Inference API:",
        response.data
      );
      return "I’m sorry, something went wrong during generation.";
    }

    // 8) If the model echoed the prompt, strip it off
    if (generated.startsWith(prompt)) {
      return generated.slice(prompt.length).trim();
    }
    return generated.trim();
  } catch (err) {
    
    // 9) Catch any network/HTTP error and return fallback
    // console.error("⛔ Hugging Face Inference API error:", err.message || err);
    // return "I’m sorry, I don’t see that information in the portal.";
    if (err.response) {
      // Server responded with non-2xx status code
      console.error("⛔ Hugging Face API returned error:", {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      });
    } else if (err.request) {
      // Request was made but no response received
      console.error("⛔ No response from Hugging Face API:", err.request);
    } else {
      // Something else happened
      console.error("⛔ Error setting up Hugging Face API request:", err.message);
    }

    console.error("🔎 Full error:", err);
    return "I’m sorry, I don’t see that information in the portal.";

  }
}

module.exports = { generateAnswer };
