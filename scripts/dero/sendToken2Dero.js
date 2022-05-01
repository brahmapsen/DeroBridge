const DeroBridge = artifacts.require('./DeroBridge.sol');
const DeroBridgeJson = require('../../build/contracts/DeroBridge.json');
const MyToken = artifacts.require('./MyToken.sol');
const MyTokenJson = require('../../build/contracts/MyToken.json');
const deroRecipient = process.env.DERO_WALLET_ADDR || "";

module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();

  const bridge = await DeroBridge.deployed();
  const name = await bridge.getName();
  console.log('Name:', name, " Recipient:", deroRecipient);

  const bridgeContractAddress = DeroBridgeJson.networks['4'].address;
  console.log("Bridge deployed at address: ", bridgeContractAddress);

  const myToken = await MyToken.deployed();
  const tokenAddress = MyTokenJson.networks['4'].address;
  console.log('MyToken deployed at address:', tokenAddress);

  //Approve myToken for transfer
  const amount = 10;
  await myToken.approve(bridgeContractAddress, amount );
  console.log("myToken Approved")

  console.log("Make lock asset call to DERO Bridge contract")
  await bridge.lockAssets( amount, tokenAddress, deroRecipient);

  //Find how much asset is locked in the contract
  const lockAsset = web3.utils.fromWei(await bridge.getLockedAsset(tokenAddress), "ether");
  console.log("Sender:", sender, " MyToken Locked:", lockAsset);

  done();

}

