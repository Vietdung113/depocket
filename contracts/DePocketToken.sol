pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DePocketToken is ERC20 {
    address public president ;
    address public vicePresident;
    address public accountant;
    uint private _limitAmoutOfVP = 500;
    uint private _id;
    struct TransferRequest {
        uint id;
        address to;
        uint amount;
    }
    mapping(uint=> bool) private isApproved;
    mapping(uint => TransferRequest) private requests;

    constructor() ERC20("DePocket Token", "DP"){
        _mint(address(this), 1000000);
        _id = 0;
        president = msg.sender;
        vicePresident = msg.sender;
        accountant = msg.sender;
    }
    modifier onlyCLevel(){
        require(msg.sender == president || msg.sender == vicePresident, "Permission Deny");
        _;
    }
    modifier onlyPresident(){
        require(msg.sender == president, "Permission Deny");
        _;
    }
    modifier onlyVicePresident(){
        require(msg.sender == vicePresident, "Permission Deny");
        _;
    }
    modifier onlyAccountant(){
        require(msg.sender == accountant, "Permission Deny");
        _;
    }
    function setPresident(address newPresident) external onlyPresident {
        president = newPresident;
    }
    function getLimitAmountOfVP() external view returns(uint){
        return _limitAmoutOfVP;
    }
    function setLimitAmountOfVP(uint amount) external onlyPresident {
        _limitAmoutOfVP = amount;
    }
    function deposit(uint amount) external onlyPresident {
        IERC20(address(this)).transferFrom(msg.sender, address(this), amount);

    }

    function withdraw(uint amount) external onlyCLevel {
        uint currentBalance = IERC20(address(this)).balanceOf(address(this));
        require(currentBalance > amount, "Amount Exceed Current Balance");
        if(amount >= _limitAmoutOfVP){
            require(msg.sender == president, "Amount With Draw Exceed Permission");
        }
        IERC20(address(this)).transfer(president, amount);
    }
    function getRequest(uint id) external view returns(uint amount, address to){
        amount = requests[id].amount;
        to = requests[id].to;
    }
    function setAccountant (address newAccountant) external {
        require(msg.sender == accountant || msg.sender == president|| msg.sender == vicePresident, "Permission deny");
        accountant = newAccountant;
    }
    event CreateTransferRequest(uint _id, uint amount, address to);
    function createTransferRequest(uint amount, address to) external onlyAccountant returns(uint){
        _id +=1;
        TransferRequest memory request = TransferRequest(_id, to, amount);
        requests[_id] = request;
        emit CreateTransferRequest(_id, amount, to);
        return _id;
    }
    function confirmRequest(uint requestId) external onlyCLevel{
        require(isApproved[requestId]== false, "Request already confirm");
        uint amount = requests[requestId].amount;
        if(amount >= _limitAmoutOfVP){
            require(msg.sender==president, "Permission Deny");
        }
        isApproved[requestId] = true;
    }
    function transferByAccountant(uint requestId) external onlyAccountant {
        require(isApproved[requestId] == true, "Transaction hasn't confirm yet");
        uint amount = requests[requestId].amount;
        address to = requests[requestId].to;
        uint currentBalance = IERC20(address(this)).balanceOf(address(this));
        require(currentBalance >= amount , "Insufficient amount");
        
        delete requests[requestId];
        delete isApproved[requestId];
        IERC20(address(this)).transfer(to, amount);
    }

}