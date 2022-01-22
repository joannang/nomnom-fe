// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Supplier {

    address payable owner;

    struct Food {
        string name;
        uint256 price;
    }

    struct Voucher {
        string name;
        uint256 value;
        uint256 validityPeriod;
    }

    struct Reward {
        string name;
        uint256 target;
    }

    mapping (string => Food) public foodMeta;
    mapping (string => Voucher) public voucherMeta;
    mapping (string => Reward) public rewardMeta;

    mapping (string => Food[]) public foods;
    mapping (string => Voucher[]) public vouchers;
    mapping (string => Reward[]) public rewards;

    constructor() {
        owner = payable(msg.sender);
    }

    function listFood(string memory _name, string memory _restaurant, uint256 _price) public {
        Food memory food = Food({
            name: _name,
            price: _price
        });
        foodMeta[_name] = food;
        foods[_restaurant].push(food);
    }

    function getFoodPrice(string memory name) public view returns (uint256) {
        return foodMeta[name].price;
    }

    function listVoucher(string memory _name, string memory _restaurant, uint256 _value, uint256 _validityPeriod) public {
        Voucher memory voucher = Voucher({
            name: _name,
            value: _value,
            validityPeriod: _validityPeriod
        });
        voucherMeta[_name] = voucher;
        vouchers[_restaurant].push(voucher);
    }

    function listReward(string memory _name, string memory _restaurant, uint256 _target) public {
        Reward memory reward = Reward({
            name: _name,
            target: _target
        });
        rewardMeta[_name] = reward;
        rewards[_restaurant].push(reward);
    }

    // function buyBooster(){}
    // function useBooster(){}

}
