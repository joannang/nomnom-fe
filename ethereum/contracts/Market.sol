// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;


import './Supplier.sol';
import './Food.sol';
import './Voucher.sol';

contract Market {

    // struct Token {
    //     string foodName;
    //     string tokenID;
    // }

    struct Customer {
        uint256 buyCount;
        uint256[] ownedFoods;
        uint256[] ownedVouchers;
        uint256[] ownedRewards;
    }

    Supplier public supplier;
    Food public food;
    Voucher public voucher;

    mapping (address => Customer) private customers;

    uint256 lastTokenID;

    constructor() payable {
        supplier = new Supplier();
        food = new Food();
        voucher = new Voucher();
    }

    function buyFood(string memory foodName) public payable returns (uint256){
        uint256 price = supplier.getFoodPrice(foodName);
        require(msg.value >= price, "Insufficient money");
        uint256 tokenID = food.buy(msg.sender, foodName); // mint token
        // Token memory foodToken = Token({
        //     foodName: foodName,
        //     tokenID: tokenID
        // });
        // mommomTokens[tokenID] = mommomToken; // track all tokens
        customers[msg.sender].ownedFoods.push(tokenID); // track all customer tokens
        lastTokenID = tokenID;
        // getCustomerMommomsToken();
        return tokenID;
    }

    function redeemFood(uint256 tokenID) public {
        revokeOwnership(msg.sender, tokenID);
        food.redeem(msg.sender, tokenID);
        // string memory foodID = food.tokenURI(tokenID);
        // getCustomerMommomsToken();
    }

    function giftFood(address receiver, uint256 tokenID) public {
        revokeOwnership(msg.sender, tokenID);
        food.gift(msg.sender, receiver, tokenID);
        customers[receiver].ownedFoods.push(tokenID);
        // string memory foodID = food.tokenURI(tokenID);
        // getCustomerMommomsToken();
    }

    function buyAndGiftFood(string memory foodID, address receiver) public payable {
        uint256 tokenID = buyFood(foodID);
        giftFood(receiver, tokenID);
        // getCustomerMommomsToken();
        // lastTokenList[receiver] = customers[receiver].ownedMommoms;
    }

    function revokeOwnership(address owner, uint256 tokenID) private {
        uint256 oldTokenBalance = food.balanceOf(msg.sender);
        Customer storage customer = customers[owner];
        uint256[] storage ownedFoods = customer.ownedFoods;
        for (uint256 i = 0; i < oldTokenBalance; i++) {
            if (ownedFoods[i] == tokenID) {
                ownedFoods[i] = ownedFoods[oldTokenBalance - 1];
                ownedFoods.pop();
                break;
            }
        }
    }

    // function rewarded(string memory name, string memory symbol) public returns (address){
    //     Reward reward = new Reward(name, symbol);
    //     reward.rewarded(msg.sender);
    //     return address(reward);
    // }

    function getCustomerMommomsToken() public view returns (uint256[] memory) {
        return customers[msg.sender].ownedFoods;
    }

    // function getLastTokenList() public view returns(uint256[] memory) {
    //     return lastTokenList[msg.sender];
    // }

    function getFoodID(uint256 tokenID) public view returns(string memory) {
        return food.tokenURI(tokenID);
    }
}
