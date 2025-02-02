document.addEventListener("DOMContentLoaded", () => {
  // Global variables for the chat page
  let walletConnected = false;
  let userWallet = null;

  // Connect Wallet event
  document.getElementById("connectWallet").addEventListener("click", async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userWallet = accounts[0];
        walletConnected = true;
        document.getElementById("walletAddress").textContent = "Connected wallet: " + userWallet;
        document.getElementById("connectWallet").disabled = true;
      } catch (error) {
        console.error("User rejected wallet connection", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to use this feature.");
    }
  });

  // Chat form event
  document.getElementById("chat-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    const inputField = document.getElementById("user-input");
    const userMessage = inputField.value.trim();
    if (userMessage === "") return;
    appendMessage("user", userMessage);
    inputField.value = "";
    // Simulate a bot response after a short delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      appendMessage("bot", botResponse);
    }, 500);
  });

  function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = text;
    messageElement.appendChild(messageContent);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

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
});
