const API_KEY = "YOUR_GEMINI_API_KEY"; // replace with your key
const MODEL = "gemini-2.5-flash"; // fast model

// --- Token Estimation (rough) ---
function estimateTokens(text) {
  return Math.ceil(text.length / 4); // approx: 1 token ≈ 4 chars
}

function tokenizeText(text) {
  // simple tokenization: split on spaces/punctuation
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

// --- Main Send Function ---
async function sendPrompt() {
  const systemPrompt = document.getElementById("systemPrompt").value;
  const userPrompt = document.getElementById("userPrompt").value;
  const mode = document.getElementById("mode").value;
  const temperature = parseFloat(document.getElementById("temperature").value);
  const topP = parseFloat(document.getElementById("topP").value);
  const topK = parseInt(document.getElementById("topK").value);

  // Stop sequences (comma separated input)
  const stopSeqInput = document.getElementById("stopSeq")?.value || "";
  const stopSequences = stopSeqInput
    ? stopSeqInput.split(",").map(s => s.trim())
    : [];

  // JSON output toggle
  const jsonMode = document.getElementById("jsonMode")?.checked;

  let finalPrompt = userPrompt;

  // Handle one-shot / multi-shot examples
  if (mode === "one") {
    finalPrompt = `Example: Q: What is the capital of France? A: Paris.\n\nNow, Q: ${userPrompt}`;
  } else if (mode === "multi") {
    finalPrompt = `Example 1: Q: What is 2+2? A: 4.\nExample 2: Q: What is the capital of Japan? A: Tokyo.\n\nNow, Q: ${userPrompt}`;
  }

  // Force JSON output mode
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

    // update token info
    updateTokenInfo(finalPrompt, responseText);

  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }
}

// --- Clear Output ---
function clearOutput() {
  document.getElementById("output").textContent = "";
  document.getElementById("tokenInfo").textContent = "Tokens: 0 (approx.)";
}
