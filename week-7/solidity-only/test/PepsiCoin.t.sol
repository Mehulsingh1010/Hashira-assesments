// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/PepsiCoin.sol";

contract PepsiCoinTest is Test {
    PepsiCoin public token;

    address owner = address(this);     
    address person1 = address(0xA1);
    address person2   = address(0xB0);
    address zero  = address(0);

    uint256 constant INITIAL_SUPPLY     = 1000 ether;
    uint256 constant FAUCET_DAILY       = 100 ether;
    uint256 constant FAUCET_LIFETIME    = 500 ether;

    event Transfer(address indexed from, address indexed to, uint256 indexed value);
    event Approval(address indexed owner, address indexed spender, uint256 indexed value);
    event FaucetClaimed(address indexed claimer, uint256 indexed amount);
    event Mint(address indexed to, uint256 indexed amount);
    event OwnershipRenounced(address indexed previousOwner);

    function setUp() public {
        token = new PepsiCoin(INITIAL_SUPPLY);
    }

    /* ========== DEPLOYMENT & INITIAL STATE ========== */

    function test_InitialSupplyAndOwner() public {
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
        assertEq(token.owner(), owner);
        assertEq(token.FAUCET_DAILY_AMOUNT(), FAUCET_DAILY);
        assertEq(token.FAUCET_LIFETIME_CAP(), FAUCET_LIFETIME);
    }

    function test_ConstructorRevertsOnZeroSupply() public {
        vm.expectRevert(PepsiCoin.AmountMustBeGreaterThanZero.selector);
        new PepsiCoin(0);
    }

    /* ========== TRANSFER ========== */

    function test_TransferSuccess() public {
        vm.expectEmit(true, true, true, true);
        emit Transfer(owner, person1, 300 ether);

        token.transfer(person1, 300 ether);

        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - 300 ether);
        assertEq(token.balanceOf(person1), 300 ether);
    }

    function test_TransferRevertsZeroAddress() public {
        vm.expectRevert(PepsiCoin.ZeroAddress.selector);
        token.transfer(zero, 100 ether);
    }

    function test_TransferRevertsZeroAmount() public {
        vm.expectRevert(PepsiCoin.AmountMustBeGreaterThanZero.selector);
        token.transfer(person1, 0);
    }

    function test_TransferRevertsInsufficientBalance() public {
        vm.prank(person1);
        vm.expectRevert(PepsiCoin.InsufficientBalance.selector);
        token.transfer(person2, 1 ether);
    }

    /* ========== APPROVE & TRANSFERFROM ========== */

    function test_ApproveSuccess() public {
        vm.expectEmit(true, true, true, true);
        emit Approval(owner, person1, 400 ether);

        token.approve(person1, 400 ether);
        assertEq(token.allowance(owner, person1), 400 ether);
    }

    function test_ApproveRevertsZeroAddress() public {
        vm.expectRevert(PepsiCoin.ZeroAddress.selector);
        token.approve(zero, 100 ether);
    }

    function test_TransferFromSuccess() public {
        token.approve(person1, 500 ether);

        vm.prank(person1);
        vm.expectEmit(true, true, true, true);
        emit Transfer(owner, person2, 250 ether);

        token.transferFrom(owner, person2, 250 ether);

        assertEq(token.balanceOf(person2), 250 ether);
        assertEq(token.allowance(owner, person1), 500 ether - 250 ether);
    }

    function test_TransferFromRevertsInsufficientAllowance() public {
        token.approve(person1, 50 ether);

        vm.prank(person1);
        vm.expectRevert(PepsiCoin.InsufficientAllowance.selector);
        token.transferFrom(owner, person2, 51 ether);
    }

    function test_TransferFromRevertsZeroAddressesAndAmount() public {
        token.approve(person1, 100 ether);

        vm.prank(person1);
        vm.expectRevert(PepsiCoin.ZeroAddress.selector);
        token.transferFrom(zero, person2, 10 ether);

        vm.expectRevert(PepsiCoin.ZeroAddress.selector);
        token.transferFrom(owner, zero, 10 ether);

        vm.expectRevert(PepsiCoin.AmountMustBeGreaterThanZero.selector);
        token.transferFrom(owner, person2, 0);
    }

    /* ========== MINT ========== */

    function test_OwnerCanMint() public {
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), person1, 600 ether);
        vm.expectEmit(true, false, true, true);
        emit Mint(person1, 600 ether);

        token.mint(person1, 600 ether);

        assertEq(token.totalSupply(), INITIAL_SUPPLY + 600 ether);
        assertEq(token.balanceOf(person1), 600 ether);
    }

    function test_NonOwnerCannotMint() public {
        vm.prank(person1);
        vm.expectRevert(PepsiCoin.OnlyOwner.selector);
        token.mint(person1, 100 ether);
    }

    function test_MintRevertsInvalidInputs() public {
        vm.expectRevert(PepsiCoin.ZeroAddress.selector);
        token.mint(zero, 100 ether);

        vm.expectRevert(PepsiCoin.AmountMustBeGreaterThanZero.selector);
        token.mint(person1, 0);
    }

    /* ========== BURN ========== */

    function test_BurnSuccess() public {
        token.transfer(person1, 200 ether);

        vm.prank(person1);
        vm.expectEmit(true, true, true, true);
        emit Transfer(person1, address(0), 150 ether);

        token.burn(150 ether);

        assertEq(token.balanceOf(person1), 50 ether);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - 150 ether);
    }

    function test_BurnRevertsInvalidInputs() public {
        vm.prank(person1);
        vm.expectRevert(PepsiCoin.InsufficientBalance.selector);
        token.burn(1 ether);

        token.transfer(person1, 100 ether);
        vm.prank(person1);
        vm.expectRevert(PepsiCoin.AmountMustBeGreaterThanZero.selector);
        token.burn(0);
    }

    /* ========== FAUCET ========== */

    function test_FaucetFirstClaim() public {
        vm.prank(person1);
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), person1, FAUCET_DAILY);
        vm.expectEmit(true, false, true, true);
        emit FaucetClaimed(person1, FAUCET_DAILY);

        token.faucet();

        assertEq(token.balanceOf(person1), FAUCET_DAILY);
        assertEq(token.faucetClaimedTotal(person1), FAUCET_DAILY);
    }

    function test_FaucetCooldown() public {
        vm.startPrank(person1);
        token.faucet();

        vm.expectRevert(PepsiCoin.FaucetCooldownNotOver.selector);
        token.faucet();

        vm.warp(block.timestamp + 1 days + 1);
        token.faucet();
        vm.stopPrank();
    }

    function test_FaucetLifetimeCap() public {
        vm.startPrank(person1);

        // Claim exactly 5 times → reach 500 cap
        for (uint i = 0; i < 5; i++) {
            token.faucet();
            vm.warp(block.timestamp + 1 days + 1);
        }

        assertEq(token.faucetClaimedTotal(person1), FAUCET_LIFETIME);
        assertEq(token.faucetRemaining(person1), 0);

        vm.expectRevert(PepsiCoin.FaucetLifetimeCapReached.selector);
        token.faucet();

        vm.stopPrank();
    }

    function test_FaucetViewFunctions() public {
        assertEq(token.timeUntilNextFaucet(person1), 0);
        assertEq(token.faucetRemaining(person1), FAUCET_LIFETIME);

        vm.prank(person1);
        token.faucet();

        uint256 timeLeft = token.timeUntilNextFaucet(person1);
        assertGt(timeLeft, 86_300);
        assertLe(timeLeft, 86_400);
    }

    /* ========== RENOUNCE OWNERSHIP ========== */

    function test_RenounceOwnership() public {
        vm.expectEmit(true, true, false, false);
        emit OwnershipRenounced(owner);

        token.renounceOwnership();
        assertEq(token.owner(), address(0));
    }

    function test_RenounceOnlyOwner() public {
        vm.prank(person1);
        vm.expectRevert(PepsiCoin.OnlyOwner.selector);
        token.renounceOwnership();
    }

    function test_NoMintAfterRenounce() public {
        token.renounceOwnership();

        vm.expectRevert(PepsiCoin.OnlyOwner.selector);
        token.mint(person1, 100 ether);
    }
}