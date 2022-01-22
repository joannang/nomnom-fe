// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Supplier {

    address payable owner;
    string public name;

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

    constructor(string memory _name) {
        owner = payable(msg.sender);
        name = _name;
    }

    function listFood(string memory _name, string memory _restaurant, uint256 _price) public {
        Food memory food = Food({
            name: _name,
            price: _price
        });
        foodMeta[_name] = food;
        foods[_restaurant].push(food);
    }

    function listVoucher(string memory _name, string memory _restaurant, uint256 _value, uint256 _validityPeriod) public {
        Voucher memory voucher = Voucher({
            name: _name,
            value: _value,
            validityPeriod: _validityPeriod
        });
        voucherMeta[name] = voucher;
        vouchers[_restaurant].push(voucher);
    }

    function listReward(string memory _name, string memory _restaurant, uint256 _target) public {
        Reward memory reward = Reward({
            name: _name,
            target: _target
        });
        rewardMeta[name] = reward;
        rewards[_restaurant].push(reward);
    }

    // function buyBooster(){}
    // function useBooster(){}

}
