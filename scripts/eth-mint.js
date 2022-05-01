const TokenEth = artifacts.require('./TokenEth.sol')
const BridgeEth = artifacts.require('./BridgeEth.sol');

module.exports = async done => {
    const [sender, _] = await web3.eth.getAccounts();
    const tokenEth = await TokenEth.deployed();

    let _balance = await tokenEth.balanceOf(sender);
    console.log('prior to Mint ETH Balance:', _balance.toString());

    // await tokenEth.mint(sender, 1000);
    // console.log("Eth token mint");

    const bridgeEth = await BridgeEth.deployed();
    console.log('BridgeEth Nonce:', bridgeEth.nonce);
    await bridgeEth.mint(sender, 10, bridgeEth.nonce);

    done();
}

