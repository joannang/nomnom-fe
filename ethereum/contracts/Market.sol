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
    mapping (address => Customer) private customers;

    constructor() payable {
        supplier = new Supplier();
    }

    function buyFood(string memory foodName, string memory restaurantName) public payable returns (uint256){
        Food storage food = foods[foodID];
        require(msg.value >= food.price, "Insufficient money");
        uint256 tokenID = mommom.buy(msg.sender, foodID); // mint token
        MommomToken memory mommomToken = MommomToken({
            tokenID: tokenID,
            redeemed: false
        });
        mommomTokens[tokenID] = mommomToken; // track all tokens
        customers[msg.sender].ownedMommoms.push(tokenID); // track all customer tokens
        lastTokenID[msg.sender] = tokenID;
        getCustomerMommomsToken();
        return tokenID;
    }

    function redeem(uint256 tokenID) public {
        require(mommomTokens[tokenID].redeemed == false);
        revokeOwnership(msg.sender, tokenID);
        mommom.redeem(msg.sender, tokenID);
        mommomTokens[tokenID].redeemed = true;
        string memory foodID = mommom.tokenURI(tokenID);
        getCustomerMommomsToken();
    }

    function gift(address receiver, uint256 tokenID) public {
        revokeOwnership(msg.sender, tokenID);
        mommom.gift(msg.sender, receiver, tokenID);
        customers[receiver].ownedMommoms.push(tokenID);
        string memory foodID = mommom.tokenURI(tokenID);
        getCustomerMommomsToken();
    }

    function buyAndGift(string memory foodID, address receiver) public payable {
        uint256 tokenID = buy(foodID);
        gift(receiver, tokenID);
        getCustomerMommomsToken();
        lastTokenList[receiver] = customers[receiver].ownedMommoms;
    }

    function revokeOwnership(address owner, uint256 tokenID) private {
        uint256 oldTokenBalance = mommom.balanceOf(msg.sender);
        Customer storage customer = customers[owner];
        uint256[] storage ownedMommoms = customer.ownedMommoms;
        for (uint256 i = 0; i < oldTokenBalance; i++) {
            if (ownedMommoms[i] == tokenID) {
                ownedMommoms[i] = ownedMommoms[oldTokenBalance - 1];
                ownedMommoms.pop();
                break;
            }
        }
    }

    function rewarded(string memory name, string memory symbol) public returns (address){
        Reward reward = new Reward(name, symbol);
        reward.rewarded(msg.sender);
        return address(reward);
    }

    function getCustomerMommomsToken() public {
        lastTokenList[msg.sender] = customers[msg.sender].ownedMommoms;
    }

    function getLastTokenList() public view returns(uint256[] memory) {
        return lastTokenList[msg.sender];
    }

    function getFoodID(uint256 tokenID) public view returns(string memory) {
        return mommom.tokenURI(tokenID);
    }
}
