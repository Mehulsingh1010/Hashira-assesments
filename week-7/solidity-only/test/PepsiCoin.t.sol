// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/PepsiCoin.sol";

contract PepsiCoinTest is Test {
    PepsiCoin public token;

    address owner = address(this);
    address user1 = address(0x123);
    address user2 = address(0x456);

    uint256 constant INITIAL_SUPPLY = 1000 ether;
    uint256 constant FAUCET_AMOUNT = 100 ether;

    function setUp() public {
        token = new PepsiCoin(INITIAL_SUPPLY);
    }

    // --------------------------------------------------
    // DEPLOYMENT
    // --------------------------------------------------
    function testInitialSupplyAssigned() public {
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
    }

    function testOwnerSetCorrectly() public {
        assertEq(token.owner(), owner);
    }

    // --------------------------------------------------
    // TRANSFER
    // --------------------------------------------------
    function testTransfer() public {
        token.transfer(user1, 100 ether);
        assertEq(token.balanceOf(user1), 100 ether);
    }

    function testTransferFailsIfInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert(PepsiCoin.InsufficientBalance.selector);
        token.transfer(owner, 1 ether);
    }

    // --------------------------------------------------
    // APPROVE & TRANSFERFROM
    // --------------------------------------------------
    function testApproveAndTransferFrom() public {
        token.approve(user1, 200 ether);

        vm.prank(user1);
        token.transferFrom(owner, user2, 200 ether);

        assertEq(token.balanceOf(user2), 200 ether);
    }

    // --------------------------------------------------
    // FAUCET
    // --------------------------------------------------
    function testFaucetClaim() public {
        vm.prank(user1);
        token.faucet();

        assertEq(token.balanceOf(user1), FAUCET_AMOUNT);
    }

    function testFaucetCooldownReverts() public {
        vm.startPrank(user1);
        token.faucet();

        vm.expectRevert(PepsiCoin.FaucetCooldownNotOver.selector);
        token.faucet();
        vm.stopPrank();
    }

    function testFaucetLifetimeLimit() public {
        vm.startPrank(user1);

        // Claim 5 times (100 * 5 = 500)
        for (uint256 i = 0; i < 5; i++) {
            token.faucet();
            vm.warp(block.timestamp + 1 days);
        }

        vm.expectRevert(PepsiCoin.FaucetLifetimeCapReached.selector);
        token.faucet();

        vm.stopPrank();
    }

    // --------------------------------------------------
    // MINT
    // --------------------------------------------------
    function testOwnerCanMint() public {
        token.mint(user1, 500 ether);
        assertEq(token.balanceOf(user1), 500 ether);
    }

    function testNonOwnerCannotMint() public {
        vm.prank(user1);
        vm.expectRevert(PepsiCoin.OnlyOwner.selector);
        token.mint(user1, 100 ether);
    }

    // --------------------------------------------------
    // BURN
    // --------------------------------------------------
    function testBurn() public {
        token.transfer(user1, 200 ether);

        vm.prank(user1);
        token.burn(100 ether);

        assertEq(token.balanceOf(user1), 100 ether);
    }

    // --------------------------------------------------
    // OWNERSHIP
    // --------------------------------------------------
    function testRenounceOwnership() public {
        token.renounceOwnership();
        assertEq(token.owner(), address(0));
    }
}
