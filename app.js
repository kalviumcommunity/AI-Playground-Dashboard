const API_KEY="YOUR_GEMINI_API_KEY"; // put your key here
const MODEL = "gemini-2.5-flash"; // lightweight, fast model

async function sendPrompt() {
  const systemPrompt = document.getElementById("systemPrompt").value;
  const userPrompt = document.getElementById("userPrompt").value;
  const mode = document.getElementById("mode").value;
  const temperature = parseFloat(document.getElementById("temperature").value);
  const topP = parseFloat(document.getElementById("topP").value);
  const topK = parseInt(document.getElementById("topK").value);

  let finalPrompt = userPrompt;

  // Handle one-shot / multi-shot examples
  if (mode === "one") {
    finalPrompt = `Example: Q: What is the capital of France? A: Paris.\n\nNow, Q: ${userPrompt}`;
  } else if (mode === "multi") {
    finalPrompt = `Example 1: Q: What is 2+2? A: 4.\nExample 2: Q: What is the capital of Japan? A: Tokyo.\n\nNow, Q: ${userPrompt}`;
  }

  const body = {
    contents: [{ role: "user", parts: [{ text: finalPrompt }]}],
    generationConfig: {
      temperature: temperature,
      topP: topP,
      topK: topK,
      maxOutputTokens: 500
    }
  };

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    document.getElementById("output").textContent =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}
