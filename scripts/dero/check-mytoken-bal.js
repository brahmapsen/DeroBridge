const MyToken = artifacts.require('./MyToken.sol');

module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();
  const myToken = await MyToken.deployed();
  const balance = await myToken.balanceOf(sender);
  console.log('My token balance:', balance.toString());
  done();
}
