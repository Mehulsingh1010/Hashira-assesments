// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PepsiCoin {
    string public constant name = "PepsiCoin";
    string public constant symbol = "PC";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    
    // Faucet tracking
    mapping(address => uint256) public lastFaucetTime;        
    mapping(address => uint256) public faucetClaimedTotal;    
    
    uint256 public constant FAUCET_DAILY_AMOUNT = 100 * (10 ** decimals);  
    uint256 public constant FAUCET_LIFETIME_CAP = 500 * (10 ** decimals);  
    address public owner;

    // Custom errors
    error ZeroAddress();
    error InsufficientBalance();
    error InsufficientAllowance();
    error OnlyOwner();
    error FaucetCooldownNotOver();
    error AmountMustBeGreaterThanZero();
    error FaucetLifetimeCapReached();

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event FaucetClaimed(address indexed claimer, uint256 amount);
    event Mint(address indexed to, uint256 amount);                
    event OwnershipRenounced(address indexed previousOwner);       

    constructor(uint256 _initialSupply) {
        if (_initialSupply == 0) revert AmountMustBeGreaterThanZero();
        
        owner = msg.sender;
        totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ------------------ View Functions ------------------
    function balanceOf(address account) public view returns (uint256) {
        if (account == address(0)) revert ZeroAddress();
        return balances[account];
    }

    function allowance(address owner_, address spender) public view returns (uint256) {
        if (owner_ == address(0) || spender == address(0)) revert ZeroAddress();
        return allowances[owner_][spender];
    }

    // Seconds until next claim allowed (0 = can claim now)
    function timeUntilNextFaucet(address user) public view returns (uint256) {
        if (block.timestamp >= lastFaucetTime[user] + 24 hours) {
            return 0;
        }
        return (lastFaucetTime[user] + 24 hours) - block.timestamp;
    }

    // How many more faucet tokens this address can still claim (lifetime)
    function faucetRemaining(address user) public view returns (uint256) {
        if (faucetClaimedTotal[user] >= FAUCET_LIFETIME_CAP) {
            return 0;
        }
        return FAUCET_LIFETIME_CAP - faucetClaimedTotal[user];
    }

    // ------------------ Core ERC20 ------------------
    function transfer(address to, uint256 amount) public returns (bool) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountMustBeGreaterThanZero();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        if (spender == address(0)) revert ZeroAddress();

        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        if (from == address(0) || to == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountMustBeGreaterThanZero();
        if (balances[from] < amount) revert InsufficientBalance();
        if (allowances[from][msg.sender] < amount) revert InsufficientAllowance();

        allowances[from][msg.sender] -= amount;
        balances[from] -= amount;
        balances[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    // ------------------ Owner-Only Unlimited Mint ------------------
    function mint(address to, uint256 amount) public {
        if (msg.sender != owner) revert OnlyOwner();
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountMustBeGreaterThanZero();

        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }

    // ------------------ Faucet: 100 PC per day, max 500 ever ------------------
function faucet() public {
    // Allow first-time claim
    if (
        lastFaucetTime[msg.sender] != 0 &&
        block.timestamp < lastFaucetTime[msg.sender] + 24 hours
    ) {
        revert FaucetCooldownNotOver();
    }

    if (faucetClaimedTotal[msg.sender] + FAUCET_DAILY_AMOUNT > FAUCET_LIFETIME_CAP)
        revert FaucetLifetimeCapReached();

    lastFaucetTime[msg.sender] = block.timestamp;
    faucetClaimedTotal[msg.sender] += FAUCET_DAILY_AMOUNT;

    totalSupply += FAUCET_DAILY_AMOUNT;
    balances[msg.sender] += FAUCET_DAILY_AMOUNT;

    emit Transfer(address(0), msg.sender, FAUCET_DAILY_AMOUNT);
    emit FaucetClaimed(msg.sender, FAUCET_DAILY_AMOUNT);
}


    // ------------------ Burn ------------------
    function burn(uint256 amount) public {
        if (amount == 0) revert AmountMustBeGreaterThanZero();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    // ------------------ Renounce Ownership ------------------
    function renounceOwnership() public {
        if (msg.sender != owner) revert OnlyOwner();
        emit OwnershipRenounced(owner);
        owner = address(0);
    }
}