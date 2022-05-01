const BridgeEth = artifacts.require('./BridgeEth.sol');

const privKey = process.env.PRIVATE_KEY || "";

module.exports = async done => {
  const nonce = 2;
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  const amount = 10;

  const message = web3.utils.soliditySha3(
    {t: 'address', v: recipient},
    {t: 'address', v: recipient},
    {t: 'uint256', v: amount},
    {t: 'uint256', v: nonce},
  ).toString('hex');
  const { signature } = web3.eth.accounts.sign(
    message, 
    privKey
  ); 

  console.log('Private Key:', privKey);
  console.log("Ready to burn to send to BSC")

  await bridgeEth.burn(recipient, amount, nonce, signature);
  
  console.log("Burned eth to send to BSC")

  done();
}