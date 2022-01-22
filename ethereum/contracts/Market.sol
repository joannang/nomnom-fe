// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;


import './Supplier.sol';
import './Food.sol';
import './Voucher.sol';

contract Market {

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
        customers[msg.sender].ownedFoods.push(tokenID); // track all customer tokens
        lastTokenID = tokenID;
        return tokenID;
    }

    function redeemFood(uint256 tokenID) public {
        revokeFoodOwnership(msg.sender, tokenID);
        food.redeem(msg.sender, tokenID);
    }

    function giftFood(address receiver, uint256 tokenID) public {
        revokeFoodOwnership(msg.sender, tokenID);
        food.gift(msg.sender, receiver, tokenID);
        customers[receiver].ownedFoods.push(tokenID);
    }

    function buyAndGiftFood(string memory foodName, address receiver) public payable {
        uint256 tokenID = buyFood(foodName);
        giftFood(receiver, tokenID);
    }

    function revokeFoodOwnership(address owner, uint256 foodName) private {
        uint256 oldTokenBalance = food.balanceOf(msg.sender);
        Customer storage customer = customers[owner];
        uint256[] storage ownedFoods = customer.ownedFoods;
        for (uint256 i = 0; i < oldTokenBalance; i++) {
            if (ownedFoods[i] == foodName) {
                ownedFoods[i] = ownedFoods[oldTokenBalance - 1];
                ownedFoods.pop();
                break;
            }
        }
    }

    function buyFoodPromo(string memory foodName, uint256 voucherID) public payable returns(uint256){
        uint256 originalPrice = supplier.getFoodPrice(foodName);
        string memory voucherName = voucher.tokenURI(voucherID);
        uint256 discountedPrice = originalPrice - supplier.getVoucherValue(voucherName);
        require(msg.value >= discountedPrice, "Insufficient money");
        uint256 tokenID = food.buy(msg.sender, foodName); // mint token
        customers[msg.sender].ownedFoods.push(tokenID); // track all customer tokens
        lastTokenID = tokenID;
        return tokenID;
    }

    function buyAndGiftFoodPromo(string memory foodName, uint256 voucherID, address receiver) public payable {
        uint256 tokenID = buyFoodPromo(foodName, voucherID);
        giftFood(receiver, tokenID);
    }


    function buyVoucher(string memory voucherName) public payable returns (uint256){
        uint256 price = supplier.getVoucherValue(voucherName);
        require(msg.value >= price, "Insufficient money");
        uint256 tokenID = voucher.buy(msg.sender, voucherName); // mint token
        customers[msg.sender].ownedVouchers.push(tokenID); // track all customer tokens
        lastTokenID = tokenID;
        return tokenID;
    }

    function redeemVoucher(uint256 tokenID) public {
        revokeVoucherOwnership(msg.sender, tokenID);
        voucher.redeem(msg.sender, tokenID);
    }

    function giftVoucher(address receiver, uint256 tokenID) public {
        revokeVoucherOwnership(msg.sender, tokenID);
        voucher.gift(msg.sender, receiver, tokenID);
        customers[receiver].ownedVouchers.push(tokenID);
    }

    function buyAndGiftVoucher(string memory voucherName, address receiver) public payable {
        uint256 tokenID = buyVoucher(voucherName);
        giftVoucher(receiver, tokenID);
    }

    function revokeVoucherOwnership(address owner, uint256 tokenID) private {
        uint256 oldTokenBalance = voucher.balanceOf(msg.sender);
        Customer storage customer = customers[owner];
        uint256[] storage ownedVouchers = customer.ownedVouchers;
        for (uint256 i = 0; i < oldTokenBalance; i++) {
            if (ownedVouchers[i] == tokenID) {
                ownedVouchers[i] = ownedVouchers[oldTokenBalance - 1];
                ownedVouchers.pop();
                break;
            }
        }
    }

    function getCustomerMommomsToken() public view returns (uint256[] memory) {
        return customers[msg.sender].ownedFoods;
    }

    function getFoodName(uint256 tokenID) public view returns(string memory) {
        return food.tokenURI(tokenID);
    }
}
