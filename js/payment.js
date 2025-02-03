document.addEventListener("DOMContentLoaded", () => {
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

  // Payment button event
  document.getElementById("payButton").addEventListener("click", async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Based Wizard token contract address and minimal ABI (only the transfer function)
      const tokenAddress = "0xaa893870659de7a68c095f72a58bf49e8e647d2a";
      const tokenAbi = [
        "function transfer(address recipient, uint256 amount) public returns (bool)"
      ];
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      // Recipient is the same as the token address per instructions
      const recipient = tokenAddress;
      // Adjust decimals if needed. This example assumes 18 decimals.
      const amount = ethers.utils.parseUnits("1000", 18);

      const tx = await tokenContract.transfer(recipient, amount);
      console.log("Transaction submitted:", tx.hash);
      await tx.wait();
      console.log("Token payment successful!");
      // Set a flag so that the chat page knows the user has paid.
      localStorage.setItem("paid", "true");
      alert("Payment successful! You have sent 1000 Based Wizard tokens. You can now chat.");
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an error processing your payment. Please check the console for details.");
    }
  });
});
