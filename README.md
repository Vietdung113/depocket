# SETUP 
```
npm install
```
+ Turn on ganache 
+ Config port for development.

## RUN TEST
```
truffle test
```
## Deploy on testnet. 
+ Step 1: push secret key on .secret file
+ Step 2: Get [apikey](https://medium.com/@harismumtaz_19503/steps-to-deploy-and-verify-smart-contract-on-binance-smart-chain-e89377b24ae7) and put it to .apikey file
+ Step 3: deploy on testnet
```
truffle migrate --network testnet
```
Verify contract
```
truffle run verify DePocketToken --network testnet
```

