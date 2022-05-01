const Web3 = require('web3');
const BridgeEth = require('../../build/contracts/BridgeEth.json');
const BridgeBsc = require('../../build/contracts/BridgeBsc.json');

const RINKEBY_PROVIDER_URL = process.env.RINKEBY_PROVIDER_URL || "";
const web3Eth = new Web3(RINKEBY_PROVIDER_URL);

const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = process.env.PRIVATE_KEY || "";
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['4'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
);

bridgeEth.events.Transfer(
  {fromBlock: 8, step: 0}
)
.on("connected", (event) => {
  console.log("Bridge ETH connected");
})
.on('data', async event => {
  const { from, to, amount, date, nonce, signature } = event.returnValues;
  console.log('Bridge ETH Transfer Event occured: nonce', nonce);
  console.log('Ready to mint on the BSC side')
  try{
    const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
    const [gasPrice, gasCost] = await Promise.all([
      web3Bsc.eth.getGasPrice(),
      tx.estimateGas({from: admin}),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeBsc.options.address,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Bsc.eth.sendTransaction(txData);

    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
      Processed ETH transfer:
      - from ${from} 
      - to ${to} 
      - amount ${amount} tokens
      - date ${date}
      - nonce ${nonce}
    `);
  }catch(error){
    if(error.toString().search("transfer already processed") >= 0){
        //transaction alraedy processed with same nonce
        console.log("one or more Transaction processed with same nonce")
    } else {
      console.log("Error occured:", error);
    }
    
  }
  
});


  bridgeBsc.events.Transfer(
    {fromBlock: 0, step: 0}
  )
  .on("connected", (event) => {
    console.log("Bridge BSC connected");
  })
  .on('data', async event => {
    console.log('Bridge BSC Transfer Event occured');
    const { from, to, amount, date, nonce } = event.returnValues;
  
    const tx = bridgeEth.methods.mint(to, amount, nonce);
    const [gasPrice, gasCost] = await Promise.all([
      web3Eth.eth.getGasPrice(),
      tx.estimateGas({from: admin}),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeEth.options.address,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Eth.eth.sendTransaction(txData);
  
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
      Processed BSC transfer:
      - from ${from} 
      - to ${to} 
      - amount ${amount} tokens
      - date ${date}
    `);
  });
  
