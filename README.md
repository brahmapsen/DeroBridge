🏷 This repo contains decentrazlied (signed) transfer of Ethereum to BSC and transfer of ERC20 token

🏗 Project Setup

- Clone the repo
- Run "npm i"
- create a ".secret" file in main project folder that contains Mnemonics with words only for the ethereum account, not in quote
- copy .example.env as .env file
- update .env file with proper parameters values
- Get BSC token from Faucet: https://testnet.binance.org/faucet-smart

📡 TERMINAL 1: Deploy contract to TestNet

- source .env
- truffle migrate --reset --network ethTestnet -f 2 --to 2
- truffle migrate --reset --network bscTestnet -f 2 --to 2
- truffle migrate --reset --network ethTestnet -f 3 --to 3

⛽️ TERMINAL 2: START the Eth2BSC Bridge Event Listener

- source .env
- node scripts/listener/eth2BscEventListener.js

🛰 TERMINAL 3: Get ETH and BSC Token Balance:

- source .env
- truffle exec scripts/eth-token-balance.js --network ethTestnet
- truffle exec scripts/bsc-token-balance.js --network bscTestnet

🛰 Send ETH to BSC

- truffle exec scripts/eth2bsc-send.js --network ethTestnet

🛰 Send BSC to ETH

- truffle exec scripts/eth2bsc-send.js --network ethTestnet

🔭 TERMINAL 4: START the DERO Bridge Event Listener

- source .env
- node scripts/listener/DeroBridgeEventListener.js

🥇 TERMINAL 5: Lock tokens in DERO BRIDGE

- source .env
- truffle exec scripts/dero/sendToken2Dero.js --network ethTestnet
