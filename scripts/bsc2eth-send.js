const BridgeBsc = artifacts.require('./BridgeBsc.sol');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeBsc = await BridgeBsc.deployed();
  console.log("bridge bsc nonce:", bridgeBsc.nonce)
  await bridgeBsc.burn(recipient, 10);
  
  done();
}


