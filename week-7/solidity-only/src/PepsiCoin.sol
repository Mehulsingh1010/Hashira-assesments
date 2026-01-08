// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PepsiCoin {
    string public constant name = "PepsiCoin";
    string public constant symbol = "PC";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    mapping(address => uint256) public lastFaucetTime;
    mapping(address => uint256) public faucetClaimedTotal;

    uint256 public immutable FAUCET_DAILY_AMOUNT;
    uint256 public immutable FAUCET_LIFETIME_CAP;

    address public owner;

    error ZeroAddress();
    error InsufficientBalance();
    error InsufficientAllowance();
    error OnlyOwner();
    error FaucetCooldownNotOver();
    error AmountMustBeGreaterThanZero();
    error FaucetLifetimeCapReached();

    event Transfer(address indexed from, address indexed to, uint256 indexed value);
    event Approval(address indexed owner, address indexed spender, uint256 indexed value);
    event FaucetClaimed(address indexed claimer, uint256 indexed amount);
    event Mint(address indexed to, uint256 indexed amount);
    event OwnershipRenounced(address indexed previousOwner);

    constructor(uint256 initialSupply) {
        if (initialSupply == 0) revert AmountMustBeGreaterThanZero();

        FAUCET_DAILY_AMOUNT = 100 * 10 ** decimals;
        FAUCET_LIFETIME_CAP = 500 * 10 ** decimals;

        owner = msg.sender;
        totalSupply = initialSupply;
        balances[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) revert ZeroAddress();
        return balances[account];
    }

    function allowance(address owner_, address spender) external view returns (uint256) {
        if (owner_ == address(0) || spender == address(0)) revert ZeroAddress();
        return allowances[owner_][spender];
    }

 function timeUntilNextFaucet(address user) external view returns (uint256) {

    if (lastFaucetTime[user] == 0) {
        return 0;
    }
    
    uint256 nextTime = lastFaucetTime[user] + 1 days;
    return block.timestamp >= nextTime ? 0 : nextTime - block.timestamp;
}

    function faucetRemaining(address user) external view returns (uint256) {
        return faucetClaimedTotal[user] >= FAUCET_LIFETIME_CAP ? 0 : FAUCET_LIFETIME_CAP - faucetClaimedTotal[user];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountMustBeGreaterThanZero();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        if (spender == address(0)) revert ZeroAddress();

        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
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

    function mint(address to, uint256 amount) external {
        if (msg.sender != owner) revert OnlyOwner();
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountMustBeGreaterThanZero();

        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }

    function faucet() external {
        if (lastFaucetTime[msg.sender] != 0 && block.timestamp < lastFaucetTime[msg.sender] + 1 days) {
            revert FaucetCooldownNotOver();
        }
        if (faucetClaimedTotal[msg.sender] + FAUCET_DAILY_AMOUNT > FAUCET_LIFETIME_CAP) {
            revert FaucetLifetimeCapReached();
        }

        lastFaucetTime[msg.sender] = block.timestamp;
        faucetClaimedTotal[msg.sender] += FAUCET_DAILY_AMOUNT;

        totalSupply += FAUCET_DAILY_AMOUNT;
        balances[msg.sender] += FAUCET_DAILY_AMOUNT;

        emit Transfer(address(0), msg.sender, FAUCET_DAILY_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_DAILY_AMOUNT);
    }

    function burn(uint256 amount) external {
        if (amount == 0) revert AmountMustBeGreaterThanZero();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function renounceOwnership() external {
        if (msg.sender != owner) revert OnlyOwner();
        emit OwnershipRenounced(owner);
        owner = address(0);
    }
}