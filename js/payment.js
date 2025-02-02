document.addEventListener("DOMContentLoaded", () => {
  // Global variables for the payment page
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
      // Create an ethers provider and signer from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Based Wizard token contract address and minimal ABI (only transfer)
      const tokenAddress = "0xaa893870659de7a68c095f72a58bf49e8e647d2a";
      const tokenAbi = [
        "function transfer(address recipient, uint256 amount) public returns (bool)"
      ];
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      // In this example, the recipient is the same as the token address (per your instructions)
      const recipient = tokenAddress;
      // Assume the token has 18 decimals; adjust if needed
      const amount = ethers.utils.parseUnits("1000", 18);

      // Execute the token transfer
      const tx = await tokenContract.transfer(recipient, amount);
      console.log("Transaction submitted:", tx.hash);
      await tx.wait();
      console.log("Token payment successful!");
      alert("You have successfully sent 1000 Based Wizard tokens!");
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an error processing your payment. Please check the console for details.");
    }
  });
});
