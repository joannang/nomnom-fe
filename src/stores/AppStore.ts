import { observable, makeObservable, action, runInAction } from 'mobx';
import AppService from './AppService';
import UiState from './UiState';
import { ContractTransaction } from 'ethers';

/**
 * Only mutable data should be made observable.
 */

interface AppStore {
    appService: AppService;
    uiState: UiState;
}

export type RestaurantType = {
    _id?: string;
    restaurantName: string;
    restaurantImageUrl: string;
    restaurantDescription: string;
    restaurantWalletAddress?: string;
};

export type FoodType = {
    _id?: string;
    foodName: string;
    foodImageUrl: string;
    foodPrice: number;
    foodDescription: string;
    restaurantName?: string;
};

export type UserType = {
    _id?: number;
    userName: string;
    userPassword: string;
    userEmail: string;
    userWalletAddress: string;
    userDeliveryAddress: string;
};

export type SupplierType = {
    _id?: number;
    supplierName: string;
    supplierPassword: string;
    supplierEmail: string;
    supplierWalletAddress: string;
    supplierAddress: string;
    restaurantBooster?: {
        isBoosted: boolean;
        boostTier: number;
        boostExpiry: string;
    };
};

export type VoucherType = {
    _id?: number;
    name?: string;
    supplierName: string;
    walletAddress?: string;
    value: number;
    expiryDate: string;
};

class AppStore {
    appService = new AppService();
    allRestaurantList: RestaurantType[] = [];
    boostedRestaurantList: RestaurantType[] = [];
    unboostedRestaurantList: RestaurantType[] = [];
    voucherList: VoucherType[] = [];
    myFoodList: any[] = [];
    myTokenList: number[] = [];
    foodList: FoodType[] = [];
    friendList: UserType[] = [];
    isAuthenticated: string = sessionStorage.getItem('authenticated');
    buyCount: number = 0;
    sentCount: number = 0;
    receivedCount: number = 0;
    currentUser: UserType = {
        userName: '',
        userPassword: '',
        userEmail: '',
        userWalletAddress: '',
        userDeliveryAddress: '',
    };
    currentSupplier: SupplierType = {
        supplierName: '',
        supplierPassword: '',
        supplierEmail: '',
        supplierWalletAddress: '',
        supplierAddress: '',
    };
    redemptionFood: FoodType;
    loyaltyStatus: String;
    giftPrice: number;

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            allRestaurantList: observable,
            unboostedRestaurantList: observable,
            boostedRestaurantList: observable,
            foodList: observable,
            myFoodList: observable,
            myTokenList: observable,
            friendList: observable,
            voucherList: observable,
            currentUser: observable,
            buyCount: observable,
            sentCount: observable,
            receivedCount: observable,
            currentSupplier: observable,
            redemptionFood: observable,
            loyaltyStatus: observable,

            setIsAuthenticated: action,
            setRestaurantList: action,
            setFoodList: action,
            setMyFoodList: action,
            setFriendList: action,
            setCurrentUser: action,
            setBuyCount: action,
            setSentCount: action,
            setReceivedCount: action,
            setCurrentSupplier: action,
        });
        this.uiState = uiState;
    }

    signUp = async (user: UserType) => {
        try {
            const response = await this.appService.signUpAsync(user); // isOk & message
            if (response.isOk) {
                sessionStorage.setItem('authenticated', 'true');
                this.uiState.setSuccess(
                    'Sign up successful! Please log in to use Nomnom :)'
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    signIn = async (userId: string, password: string) => {
        try {
            const response = await this.appService.signInAsync(
                userId,
                password
            );
            if (response.loginOk) {
                this.currentUser = response.userProfile;
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem(
                    'user',
                    JSON.stringify(this.currentUser)
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    supplierSignUp = async (supplier: SupplierType) => {
        try {
            const response = await this.appService.supplierSignUpAsync(
                supplier
            );
            if (response.isOk) {
                sessionStorage.setItem('authenticated', 'true');
                this.uiState.setSuccess(
                    'Sign up successful! Please log in to use Nomnom :)'
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    supplierSignIn = async (supplierName: string, password: string) => {
        try {
            const response = await this.appService.supplierSignInAsync(
                supplierName,
                password
            );
            if (response.loginOk) {
                const { supplierProfile, restaurantProfile } = response;

                this.currentSupplier = supplierProfile;
                this.currentSupplier.restaurantBooster =
                    restaurantProfile.restaurantBooster;
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem(
                    'supplier',
                    JSON.stringify(this.currentSupplier)
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    addFood = async (food: FoodType) => {
        try {
            const response = await this.appService.addFoodAsync(food);
            if (response.isOk) {
                this.uiState.setSuccess(
                    `${food.foodName} has been successfully added!`
                );

                runInAction(() => (this.foodList = [...this.foodList, food]));
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    addVoucher = async (voucher: VoucherType) => {
        try {
            const response = await this.appService.addVoucherAsync(voucher);
            if (response.isOk) {
                this.uiState.setSuccess(
                    `Your voucher has been successfully added!`
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    getVouchers = async (restaurantName: string) => {
        try {
            const voucherList = await this.appService.getVouchersAsync(restaurantName);
            console.log(voucherList);
            runInAction(() => (this.voucherList = [...voucherList]));
        } catch (err) {
            this.uiState.setError(err.message);
        }
    }

    createRestaurant = async (restaurant: RestaurantType) => {
        try {
            const response = await this.appService.createRestaurantAsync(
                restaurant
            );
            if (!response.isOk) {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    sendFriendRequest = async (username: string, recipient: string) => {
        try {
            const response = await this.appService.sendFriendRequestAsync(
                username,
                recipient
            );
            if (response.isOk) {
                this.uiState.setSuccess(
                    `Your friend request to ${recipient} has been sent!`
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    respondToFriendRequest = async (
        senderUserName: string,
        receiverUserName: string,
        isAccepted: boolean
    ) => {
        try {
            const response = await this.appService.respondToFriendRequestAsync(
                senderUserName,
                receiverUserName,
                isAccepted
            );
            if (response.isOk) {
                this.uiState.setSuccess(
                    `You're now friends with ${senderUserName}!`
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    // @action
    setIsAuthenticated = (auth: string) => {
        this.isAuthenticated = auth;
    };

    // @action
    setRestaurantList = async () => {
        try {
            const allRestaurantList = await this.appService.getRestaurants();
            const boostedRestaurant = []
            const unboostedRestaurant = []
            for (let goldTier of allRestaurantList[3]) {
                boostedRestaurant.push(goldTier)
            }
            for (let silverTier of allRestaurantList[2]) {
                boostedRestaurant.push(silverTier)
            }
            for (let bronzeTier of allRestaurantList[1]) {
                boostedRestaurant.push(bronzeTier)
            }
            for (let unboosted of allRestaurantList[0]) {
                unboostedRestaurant.push(unboosted)
            }

            console.log(unboostedRestaurant)
            console.log(boostedRestaurant)

            // runInAction is required to update observable
            runInAction(() => {
                this.allRestaurantList = [...allRestaurantList['data']];
                this.boostedRestaurantList = [...boostedRestaurant];
                this.unboostedRestaurantList = [...unboostedRestaurant];
            });
        } catch (err) {
            console.log(err);
        }
    };

    // @action
    setFoodList = async (restaurantName: string) => {
        try {
            const foodList = await this.appService.getFoods(restaurantName);

            // runInAction is required to update observable
            runInAction(() => (this.foodList = [...foodList]));
        } catch (err) {
            console.log(err);
        }
    };

    getFoodList() {
        return this.foodList;
    }

    getVoucherList() {
        return this.voucherList;
    }

    // @action
    setFriendList = (list: UserType[]) => {
        this.friendList = list;
    };

    getAllRestaurants() {
        return this.allRestaurantList;
    }

    getBoostedRestaurants() {
        return this.boostedRestaurantList;
    }

    getUnboostedRestaurants() {
        return this.unboostedRestaurantList;
    }

    buyAndRedeemBooster = (tier: number) => {
        return this.appService.buyAndRedeemBooster(tier)
    }

    // @action
    setCurrentUser = (user: UserType) => {
        const {
            userName,
            userEmail,
            userPassword,
            userWalletAddress,
            userDeliveryAddress,
        } = user;
        this.currentUser = {
            userName: userName ? userName : this.currentUser.userName,
            userEmail: userEmail ? userEmail : this.currentUser.userEmail,
            userPassword: userPassword
                ? userPassword
                : this.currentUser.userPassword,
            userWalletAddress: userWalletAddress
                ? userWalletAddress
                : this.currentUser.userWalletAddress,
            userDeliveryAddress: userDeliveryAddress
                ? userDeliveryAddress
                : this.currentUser.userDeliveryAddress,
        };
    };

    setCurrentSupplier = (supplier: SupplierType) => {
        const {
            supplierName,
            supplierEmail,
            supplierPassword,
            supplierWalletAddress,
            supplierAddress,
        } = supplier;
        this.currentSupplier = {
            supplierName: supplierName
                ? supplierName
                : this.currentSupplier.supplierName,
            supplierEmail: supplierEmail
                ? supplierEmail
                : this.currentSupplier.supplierEmail,
            supplierPassword: supplierPassword
                ? supplierPassword
                : this.currentSupplier.supplierPassword,
            supplierWalletAddress: supplierWalletAddress
                ? supplierWalletAddress
                : this.currentSupplier.supplierWalletAddress,
            supplierAddress: supplierAddress
                ? supplierAddress
                : this.currentSupplier.supplierAddress,
        };
    };

    setBuyCount = (count: number) => {
        this.buyCount = count;
    };

    setSentCount = (count: number) => {
        this.sentCount = count;
    };

    setReceivedCount = (count: number) => {
        this.receivedCount = count;
    };

    setRedemptionFood = (food: FoodType) => {
        this.redemptionFood = food;
    };

    buyFood = async (food: FoodType, price: number) => {
        try {
            this.uiState.setIsLoading(true);
            // Interacts with the borrow media method in the contract
            const tx: ContractTransaction = await this.appService.buyFoodAsync(
                food._id, price
            );
            await tx.wait();
            const tokenId = (
                await this.appService.getLastTokenId(
                    this.currentUser.userWalletAddress
                )
            ).toNumber();
            this.uiState.setIsLoading(false);
            console.log('Token id', tokenId);
            this.uiState.setSuccess('Successfully bought ' + food.foodName);
            console.log('Successfully bought' + food.foodName);
        } catch (err) {
            const errorMsg = this.appService.signer
                ? `Failed to buy food, please try again!`
                : 'Please connect to your MetaMask account to buy food!';
            console.log(err);
            this.uiState.setIsLoading(false);
            this.uiState.setError(errorMsg);
        }
    };

    // @action
    setMyFoodList = async (walletAddress: string) => {
        try {
            const tokenList = await this.appService.getLastTokenListAsync();
            console.log(tokenList);

            let foodList = [];
            let foodIdList = [];

            for (let item of tokenList) {
                console.log(item);
                foodIdList.push(item[0]);
                foodList.push(item[1])
                // const foodData = await this.appService.getFood(foodID);
                // foodList.push(foodData);
            }
            foodList = await this.appService.getFood(foodIdList);

            runInAction(() => (this.myFoodList = [...foodList]));
            runInAction(() => (this.myTokenList = [...tokenList]));
        } catch (err) {
            const errorMsg = this.appService.signer
                ? `Failed to get food list, please try again!`
                : 'Please connect to your MetaMask account to view the food list!';
            console.log(err);
            this.uiState.setError(errorMsg);
        }
    };

    getmyFoodList() {
        return this.myFoodList;
    }

    // action
    async setLoyaltyStatus(userAddress: string, restaurantName: string) {
        const response = await this.appService.getLoyaltyStatus(userAddress, restaurantName);
        console.log(response.tier)
        this.loyaltyStatus = response.tier;
    }

    gift = async (
        receiverAddress: string,
        foodID: string,
        buyRequired: boolean
    ) => {
        try {
            this.uiState.setIsLoading(true);
            let tokenId = -1;
            if (!buyRequired) {
                tokenId = this.myFoodList.findIndex((food2) => {
                    return food2._id == foodID;
                });
                tokenId = this.myTokenList[tokenId];
            }
            console.log(`${foodID} tokenid is ${tokenId}`);
            const tx2: ContractTransaction = await this.appService.giftAsync(
                receiverAddress,
                foodID,
                this.giftPrice,
                buyRequired,
                tokenId
            );

            await tx2.wait();
            this.uiState.setIsLoading(false);
            this.uiState.setSuccess(
                `Successfully transferred ${foodID} to ${receiverAddress}`
            );
            console.log(
                `Successfully transferred ${foodID} to ${receiverAddress}`
            );
        } catch (err) {
            const errorMsg = this.appService.signer
                ? `Failed to gift, please try again!`
                : 'Please connect to your MetaMask account to gift!';
            console.log(err);
            this.uiState.setIsLoading(false);
            this.uiState.setError(errorMsg);
        }
    };

    redeemFood = async (tokenId: number) => {
        try {
            const response = await this.appService.redeemFood(
                tokenId
            );
            console.log(response);
        } catch (err) {
            this.uiState.setError(err.message);
        } 
    }

    getBuyProgress = async (walletAddress: string) => {
        try {
            const response = await this.appService.getBuyProgressAsync(
                walletAddress
            );
            console.log(response);
            this.setBuyCount(response.count);
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    getReceivedGifts = async (walletAddress: string) => {
        try {
            const response = await this.appService.getReceivedGiftsAsync(
                walletAddress
            );
            this.setReceivedCount(response.count);
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    getSentProgress = async (walletAddress: string) => {
        try {
            const response = await this.appService.sentGiftsProgressAsync(
                walletAddress
            );
            console.log(response);
            this.setSentCount(response.count);
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };
}

export default AppStore;
