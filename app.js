const API_KEY = "YOUR_GEMINI_API_KEY"; // replace with your key
const MODEL = "gemini-2.5-flash"; // for chat
const EMBEDDING_MODEL = "embedding-001"; // for embeddings

// In-memory vector DB
let vectorDB = []; // 

// --- Token Estimation (rough) ---
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}
function tokenizeText(text) {
  return text.split(/(\s+|[,.!?;:])/).filter(Boolean);
}
function updateTokenInfo(prompt, response) {
  const inputTokens = estimateTokens(prompt);
  const outputTokens = estimateTokens(response);
  const total = inputTokens + outputTokens;
  const tokenList = tokenizeText(response).join(" | ");
  document.getElementById("tokenInfo").innerHTML = `
    <b>Input Tokens:</b> ${inputTokens}, 
    <b>Output Tokens:</b> ${outputTokens}, 
    <b>Total:</b> ${total} (approx.)<br>
    <b>Tokenized Output:</b> ${tokenList}
  `;
}

// --- Generate Embedding ---
async function getEmbedding(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${EMBEDDING_MODEL}:embedContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } })
    }
  );
  const data = await res.json();
  return data?.embedding?.values || [];
}

// Cosine similarity
function cosineSim(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Add note to vector DB
async function addNote() {
  const noteText = document.getElementById("noteInput").value;
  if (!noteText) return alert("Please enter some text.");
  const embedding = await getEmbedding(noteText);
  vectorDB.push({ text: noteText, embedding });
  document.getElementById("noteInput").value = "";
  document.getElementById("vectorStatus").textContent =
    `✅ Added note (${vectorDB.length} stored)`;
}

// Search notes
async function searchNotes() {
  const query = document.getElementById("searchInput").value;
  if (!query) return alert("Please enter a search query.");
  const queryEmbedding = await getEmbedding(query);

  // rank by similarity
  const results = vectorDB
    .map(item => ({
      text: item.text,
      score: cosineSim(queryEmbedding, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  let output = results.map(r => `🔹 (${r.score.toFixed(3)}) ${r.text}`).join("\n");
  document.getElementById("searchResults").textContent =
    results.length > 0 ? output : "No results found.";
}

// --- Chat Playground (same as before) ---
async function sendPrompt() {
  const userPrompt = document.getElementById("userPrompt").value;
  const mode = document.getElementById("mode").value;
  const temperature = parseFloat(document.getElementById("temperature").value);
  const topP = parseFloat(document.getElementById("topP").value);
  const topK = parseInt(document.getElementById("topK").value);
  const stopSeqInput = document.getElementById("stopSeq")?.value || "";
  const stopSequences = stopSeqInput
    ? stopSeqInput.split(",").map(s => s.trim())
    : [];
  const jsonMode = document.getElementById("jsonMode")?.checked;

  let finalPrompt = userPrompt;
  if (mode === "one") {
    finalPrompt = `Example: Q: What is the capital of France? A: Paris.\n\nNow, Q: ${userPrompt}`;
  } else if (mode === "multi") {
    finalPrompt = `Example 1: Q: What is 2+2? A: 4.\nExample 2: Q: What is the capital of Japan? A: Tokyo.\n\nNow, Q: ${userPrompt}`;
  }
  if (jsonMode) {
    finalPrompt = `Respond ONLY in valid JSON format with the keys: "answer", "explanation".\n\nQuestion: ${userPrompt}`;
  }

  const body = {
    contents: [{ role: "user", parts: [{ text: finalPrompt }]}],
    generationConfig: {
      temperature,
      topP,
      topK,
      maxOutputTokens: 500,
      stopSequences: stopSequences.length > 0 ? stopSequences : undefined
    }
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );
    const data = await res.json();
    const responseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    document.getElementById("output").textContent = responseText;
    updateTokenInfo(finalPrompt, responseText);
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }
}

function clearOutput() {
  document.getElementById("output").textContent = "";
  document.getElementById("tokenInfo").textContent = "Tokens: 0 (approx.)";
}
