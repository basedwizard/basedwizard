// Listen for form submission
document.getElementById("chat-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputField = document.getElementById("user-input");
  const userMessage = inputField.value.trim();

  if (userMessage === "") return;

  // Append the user's message to the chat box
  appendMessage("user", userMessage);
  inputField.value = "";

  // Simulate a bot response after a short delay
  setTimeout(function () {
    const botResponse = getBotResponse(userMessage);
    appendMessage("bot", botResponse);
  }, 500);
});

// Function to append a message to the chat box
function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = text;

  messageElement.appendChild(messageContent);
  chatBox.appendChild(messageElement);

  // Auto-scroll to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function that returns a simple response based on user input
function getBotResponse(message) {
  const userMessage = message.toLowerCase();

  if (userMessage.includes("hello") || userMessage.includes("hi")) {
    return "Hello there! How can I help you today?";
  } else if (userMessage.includes("weather")) {
    return "The weather is always nice when you're chatting with me!";
  } else if (userMessage.includes("name")) {
    return "I'm your friendly chat bot!";
  } else if (userMessage.includes("how are you")) {
    return "I'm just a bunch of code, but I'm here to help!";
  } else {
    return "I'm not sure how to respond to that.";
  }
}
