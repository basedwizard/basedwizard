// Global variables to track wallet connection status
let walletConnected = false;
let userWallet = null;

// Connect Wallet button event listener
document.getElementById("connectWallet").addEventListener("click", async function () {
  // Check if MetaMask is installed
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      userWallet = accounts[0];
      walletConnected = true;
      document.getElementById("walletAddress").textContent = "Connected wallet: " + userWallet;
      // Optionally disable the connect button after connecting
      document.getElementById("connectWallet").disabled = true;
    } catch (error) {
      console.error("User rejected wallet connection", error);
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask to use this feature.");
  }
});

// Chat form event listener
document.getElementById("chat-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Check if wallet is connected before allowing chat messages
  if (!walletConnected) {
    alert("Please connect your wallet first.");
    return;
  }

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
