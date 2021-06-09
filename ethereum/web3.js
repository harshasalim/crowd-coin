//Get provider from Metamask

import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask - window is undefined here 
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/ca8f08b842d14c80bfc995b842790aa7'
  );
  web3 = new Web3(provider);
}
 
export default web3;