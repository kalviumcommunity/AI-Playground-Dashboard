# 🤖 AI Playground Dashboard

## Project Overview

**AI Playground Dashboard** is an interactive web-based tool to explore and experiment with Generative AI using Google’s **Gemini API**. Users can craft prompts, test different prompting techniques, control generation parameters, and view AI outputs in real-time — all through a simple HTML + Vanilla JavaScript interface.

This project serves as a **learning platform** and **sandbox** for AI experimentation, covering concepts like zero-shot, one-shot, multi-shot prompting, temperature, top-p, top-k, tokenization, embeddings, and structured outputs.

---

## Key Features

1. **Prompt Input**

   * **System Prompt**: Defines AI’s personality or instructions.
   * **User Prompt**: The actual question or task.

2. **Prompt Modes**

   * **Zero-Shot**: AI responds directly without examples.
   * **One-Shot**: Includes a single guiding example.
   * **Multi-Shot**: Provides multiple examples to improve context understanding.

3. **Generation Controls**

   * **Temperature**: Controls randomness.
   * **Top-P (nucleus sampling)**: Filters unlikely outputs.
   * **Top-K**: Limits token options to top-k probable tokens.

4. **Interactive Output**

   * Displays AI responses and supports clearing output for iterative experimentation.

5. **Future Extensions**

   * Tokenization Visualization
   * Structured JSON Output
   * Stop Sequences
   * Embeddings & Vector Search
   * Function Calling Demo

---

## Project Structure

```
AI-Playground-Dashboard/
│
├─ index.html        # Main interface
├─ app.js            # Handles API calls and UI interactions
├─ README.md         # Project documentation
└─ assets/           # Images, icons, or demo files
```

---

## Technical Implementation

### Frontend

* **HTML & CSS**: Simple responsive layout with input fields, dropdowns, sliders, and buttons.
* **JavaScript**: Handles API requests, dynamic prompt generation, and output rendering.

### Gemini API Integration

* Uses **Google Gemini API** with a free key.
* Sends POST requests with `contents` (prompt) and `generationConfig` (temperature, topP, topK, maxOutputTokens).

**Example Request Body:**

```json
{
  "contents": [{"role": "user", "parts": [{"text": "Your prompt here"}]}],
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.9,
    "topK": 40,
    "maxOutputTokens": 500
  }
}
```

* Response parsed from `data.candidates[0].content.parts[0].text`.

### Prompt Modes

* **Zero-Shot**: Sends user prompt directly.
* **One-Shot**: Adds one example.
* **Multi-Shot**: Adds multiple examples for context.

### Output Handling

* Displayed in a `<div>` with `white-space: pre-wrap`.
* Clear button resets output for new experiments.

---

## Theoretical Concepts Covered

| Concept                  | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| **Zero-Shot Prompting**  | AI generates output without examples.                                 |
| **One-Shot Prompting**   | AI is guided using a single example.                                  |
| **Multi-Shot Prompting** | AI sees multiple examples to establish context and consistency.       |
| **Temperature**          | Controls randomness of output; low = deterministic, high = creative.  |
| **Top-P (Nucleus)**      | Chooses tokens based on cumulative probability threshold.             |
| **Top-K**                | Restricts AI to select from top K most probable tokens.               |
| **Tokenization**         | Splits text into tokens the model can understand.                     |
| **Structured Output**    | Ensures output conforms to a defined structure (e.g., JSON).          |
| **Embeddings & Vectors** | Represents text as vectors for semantic similarity searches.          |
| **Function Calling**     | Demonstrates AI-driven dynamic execution of pre-defined JS functions. |

---

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/username/ai-playground-dashboard.git
cd ai-playground-dashboard
```

2. Open `index.html` in a web browser.

3. Insert your Gemini API key in `app.js`:

```js
const API_KEY = "YOUR_GEMINI_API_KEY";
```

4. Enter a system prompt, user prompt, select mode, tune parameters, and click **Send**.

5. Observe AI-generated responses in the output box.

---

## Future Scope

* Tokenization visualization
* Structured JSON output
* Stop sequences control
* Embeddings and vector-based semantic search
* Function calling based on AI instructions

---

