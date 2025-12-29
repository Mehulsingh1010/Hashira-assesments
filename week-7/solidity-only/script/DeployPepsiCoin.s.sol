// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {PepsiCoin} from "../src/PepsiCoin.sol";
import "forge-std/console.sol";  

contract DeployPepsiCoin is Script {
    function run() external {

        uint256 initialSupply = 1_000_000 * 10 ** 18;

        vm.startBroadcast(); 

        PepsiCoin pepsiCoin = new PepsiCoin(initialSupply);

        vm.stopBroadcast();

        console.log("PepsiCoin deployed at:", address(pepsiCoin));
    }
}