// DOM elements
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");

// Store conversation history
let conversationHistory = [];

// Theme management
let currentTheme = localStorage.getItem("theme") || "dark";
applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light-theme");
    themeIcon.textContent = "☀️";
  } else {
    document.body.classList.remove("light-theme");
    themeIcon.textContent = "🌙";
  }
}

// Handle form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();

  // Prevent empty submissions
  if (!userMessage) return;

  // Clear input immediately
  input.value = "";

  // Disable form during processing
  setFormDisabled(true);

  // Add user's message to chat box
  appendMessage("user", userMessage);

  // Add user message to conversation history
  conversationHistory.push({
    role: "user",
    text: userMessage,
  });

  // Show temporary "Thinking..." bot message
  const thinkingMessageElement = appendMessage("bot", "Thinking...");

  try {
    // Send POST request to backend
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: conversationHistory,
      }),
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if data exists in response (backend returns { message: "Success", data: chatResponse })
    if (data.data) {
      // Replace "Thinking..." with AI's reply
      updateMessage(thinkingMessageElement, data.data);

      // Add AI response to conversation history
      conversationHistory.push({
        role: "model",
        text: data.data,
      });
    } else {
      // No result in response
      updateMessage(thinkingMessageElement, "Sorry, no response received.");
    }
  } catch (error) {
    console.error("Error:", error);
    // Show error message
    updateMessage(
      thinkingMessageElement,
      "Failed to get response from server.",
    );
  } finally {
    // Re-enable form
    setFormDisabled(false);
    // Focus back on input
    input.focus();
  }
});

/**
 * Append a new message to the chat box
 * @param {string} sender - 'user' or 'bot'
 * @param {string} text - The message text
 * @returns {HTMLElement} The created message element
 */
function appendMessage(sender, text) {
  // Create wrapper for better alignment
  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper", sender);

  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  // Format bot messages for better readability
  if (sender === "bot") {
    msg.innerHTML = formatBotMessage(text);
  } else {
    msg.textContent = text;
  }

  wrapper.appendChild(msg);
  chatBox.appendChild(wrapper);

  // Auto-scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg;
}

/**
 * Update an existing message element with new text
 * @param {HTMLElement} element - The message element to update
 * @param {string} text - The new text
 */
function updateMessage(element, text) {
  // Check if it's a bot message for formatting
  if (element.classList.contains("bot")) {
    element.innerHTML = formatBotMessage(text);
  } else {
    element.textContent = text;
  }

  // Auto-scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Format bot message text for better readability
 * @param {string} text - The text to format
 * @returns {string} Formatted HTML
 */
function formatBotMessage(text) {
  // Escape HTML to prevent XSS
  const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  let formatted = escapeHtml(text);

  // Format bold text: **text** or __text__
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Format italic text: *text* or _text_
  formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/_(.+?)_/g, "<em>$1</em>");

  // Format inline code: `code`
  formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Format code blocks: ```code```
  formatted = formatted.replace(
    /```([\s\S]+?)```/g,
    "<pre><code>$1</code></pre>",
  );

  // Format numbered lists
  formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");
  formatted = formatted.replace(/(<li>.*<\/li>)/s, "<ol>$1</ol>");

  // Format bullet lists
  formatted = formatted.replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>");
  formatted = formatted.replace(/(<li>.*<\/li>)/s, (match) => {
    if (!match.includes("<ol>")) {
      return "<ul>" + match + "</ul>";
    }
    return match;
  });

  // Format line breaks (double newline = paragraph)
  const paragraphs = formatted.split(/\n\n+/);
  if (paragraphs.length > 1) {
    formatted = paragraphs.map((p) => `<p>${p.trim()}</p>`).join("");
  }

  // Single line breaks
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
}

/**
 * Enable or disable form input and button
 * @param {boolean} disabled - Whether to disable the form
 */
function setFormDisabled(disabled) {
  input.disabled = disabled;
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = disabled;
  }
}
