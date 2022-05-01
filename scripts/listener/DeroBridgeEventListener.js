const Web3 = require('web3');
const DeroBridge = require('../../build/contracts/DeroBridge.json');

const RINKEBY_PROVIDER_URL = process.env.RINKEBY_PROVIDER_URL || "";
const web3Eth = new Web3(RINKEBY_PROVIDER_URL);

const deroBridge = new web3Eth.eth.Contract(
  DeroBridge.abi,
  DeroBridge.networks['4'].address
);


deroBridge.events.CallValidators(
  { fromBlock: 0, step: 0 }
  )
  .on("connected", (event) => {
    console.log("Dero Bridge  connected");
  })
  .on("data", async (event) => {
    console.log("Event trigger to mint on dero bridge");
    const { from, to, amount, tokenAddress } = event.returnValues;
    
    console.log("From:", from, "\nTo:", to, "\nAmount:", amount, "\ntokenAddress:",tokenAddress)
    console.log("DERO BRIDGEEEEEDDDDDDDDDD");
  });


  