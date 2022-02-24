const {
  BN,
  expectRevert,
  expectEvent,
  time,
  ether,
} = require("@openzeppelin/test-helpers");
const DePocketToken = artifacts.require("DePocketToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
let DePocketTokenContract;
contract("DePocketToken", function (accounts) {

  before(async() => {
    DePocketTokenContract = await DePocketToken.new({from: accounts[0]});
  });
  it("test constructor", async() => {
    let balanceOfContract = await DePocketTokenContract.balanceOf(DePocketTokenContract.address);
    assert.equal(balanceOfContract.toString(), "1000000");
  });
  it("test withdraw and deposit", async() => {
    let withdrawAmount = new BN(1000,10);
    //set president 
    await DePocketTokenContract.setPresident(accounts[1], {from: accounts[0]});

    // withdraw
    let balanceBefore = await DePocketTokenContract.balanceOf(accounts[1]);
    await DePocketTokenContract.withdraw(withdrawAmount, {from:accounts[1]});
    let balanceAfter = await DePocketTokenContract.balanceOf(accounts[1]);
    assert.equal(balanceBefore.add(withdrawAmount).toString(), balanceAfter.toString());


    // deposit
    let depositAmount = new BN(10, 10);
    let beforeBalanceOfContract = await DePocketTokenContract.balanceOf(DePocketTokenContract.address);

    // await DePocketTokenContract.transfer(DePocketTokenContract.address, depositAmount, {from: accounts[1]});
    await DePocketTokenContract.approve(DePocketTokenContract.address, depositAmount, {from: accounts[1]});
    await DePocketTokenContract.deposit(depositAmount, {from:accounts[1]});

    let afterBalanceOfContract = await DePocketTokenContract.balanceOf(DePocketTokenContract.address);

    assert.equal(beforeBalanceOfContract.add(depositAmount).toString(), afterBalanceOfContract.toString());

    // deposit for 
  });
  it("Test Accountant", async() => {
    await DePocketTokenContract.setAccountant(accounts[3], {from: accounts[0]});

    let requestAmount = new BN(10, 10);
    
    // should catch request ID by event
    // console.log(requestID);

    // assume requestID  =1 ;
    
    
    let balanceOfAccount5Before = await DePocketTokenContract.balanceOf(accounts[5]);

    let createTransferRequestTx = await DePocketTokenContract.createTransferRequest(requestAmount, accounts[5], {from:accounts[3]});
    let options = {
      filter: {
          value: [],
      },
      fromBlock: createTransferRequestTx.blockNumber,
      toBlock: 'latest'
    };
    let createTransferRequestEvent = await DePocketTokenContract.getPastEvents('CreateTransferRequest', options);
    let requestID ;
    for (let i = 0; i < createTransferRequestEvent.length; i++){
        if (createTransferRequestEvent[i]['transactionHash'] == createTransferRequestTx['tx']){
          requestID = createTransferRequestEvent[i]['returnValues']['_id'];
          break
        }
    }
    console.log(requestID);
    await DePocketTokenContract.confirmRequest(requestID, {from: accounts[1]});

    await DePocketTokenContract.transferByAccountant(requestID, {from: accounts[3]});

    let balanceOfAccount5After = await DePocketTokenContract.balanceOf(accounts[5]);
    
    assert.equal(balanceOfAccount5Before.add(requestAmount).toString(), balanceOfAccount5After.toString());

  })



  it("should assert true", async function () {
    await DePocketToken.deployed();
    return assert.isTrue(true);
  });
});
