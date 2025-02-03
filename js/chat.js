document.addEventListener("DOMContentLoaded", () => {
  let walletConnected = false;
  let userWallet = null;
  
  // Connect Wallet event listener
  document.getElementById("connectWallet").addEventListener("click", async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userWallet = accounts[0];
        walletConnected = true;
        document.getElementById("walletAddress").textContent = "Connected wallet: " + userWallet;
        document.getElementById("connectWallet").disabled = true;
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to use this feature.");
    }
  });
  
  // Chat form event listener: on sending a message, sign it and send payment
  document.getElementById("chat-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    
    const inputField = document.getElementById("user-input");
    const messageText = inputField.value.trim();
    if (messageText === "") return;
    
    try {
      // Create an ethers provider and signer from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // STEP 1: Sign the chat message (this prompts MetaMask)
      const signature = await signer.signMessage(messageText);
      console.log("Message signature:", signature);
      
      // STEP 2: Send payment (transfer 1000 Based Wizard tokens)
      const tokenAddress = "0xaa893870659de7a68c095f72a58bf49e8e647d2a";
      const tokenAbi = [
        "function transfer(address recipient, uint256 amount) public returns (bool)"
      ];
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      
      // In this example, the recipient is the token contract address itself.
      const recipient = tokenAddress;
      // Assuming 18 decimals; change if your token uses a different number.
      const amount = ethers.utils.parseUnits("1000", 18);
      
      // Optionally, disable the Send button while processing
      const sendButton = document.querySelector("#chat-form button");
      sendButton.disabled = true;
      
      const tx = await tokenContract.transfer(recipient, amount);
      console.log("Payment transaction submitted:", tx.hash);
      await tx.wait();
      console.log("Payment successful!");
      
      // STEP 3: Append the chat message along with an excerpt of the signature
      appendMessage("user", messageText + "\n[Signature: " + signature.substring(0, 10) + "...]");
      inputField.value = "";
      
      // Re-enable the Send button
      sendButton.disabled = false;
      
    } catch (error) {
      console.error("Error sending message/payment:", error);
      alert("There was an error: " + error.message);
      document.querySelector("#chat-form button").disabled = false;
    }
  });
  
  // Helper function to append messages to the chat box
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
});
