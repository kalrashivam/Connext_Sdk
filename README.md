# Connext_Sdk
This is a node app for the connext sdk setup to be used in the EthForAll Hackathon.

Steps to use:-
1. git clone
2. yarn install
3. fill the .env file see env.example
4. yarn build fromchain tochain
6. yarn run xtransfer fromchain tochain
7. run `npx ts-node-esm ./src/index.ts` to run the api
8. the api expects query in the form npx ts-node-esm ./src/index.ts

Expected response of the format for a query like this
```
// 20230217214322
// http://localhost:3000/?fromChain=420&toChain=5&amount=36782178

{
  "relayerFee": 46041842228025600,
  "originSlippage": -8,
  "destinationSlippage": 0
}
```
