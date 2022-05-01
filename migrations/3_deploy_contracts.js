const MyToken = artifacts.require("MyToken");
const DeroBridge = artifacts.require("DeroBridge");

module.exports = async function (deployer, networks, accounts) {

  console.log(' Account 0: ', accounts[0])
  
  await deployer.deploy(MyToken);
  let add = await MyToken.deployed();
  console.log('Token address: ', add.address);

  await deployer.deploy(DeroBridge, accounts[0]);
  let briAdd = await DeroBridge.deployed();
  console.log("DeroBridge Address", briAdd.address);

};
