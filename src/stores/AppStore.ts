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
}

export type VoucherType = {
    _id? : number;
    name: string;
    walletAddress: string;
    value: number;
    expiryDate: Date;
}

class AppStore {
    appService = new AppService();
    restaurantList: RestaurantType[] = [];
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
    }
    redemptionFood: FoodType;

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            restaurantList: observable,
            foodList: observable,
            myFoodList: observable,
            myTokenList: observable,
            friendList: observable,
            currentUser: observable,
            buyCount: observable,
            sentCount: observable,
            receivedCount: observable,
            currentSupplier: observable,
            redemptionFood: observable,

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
            const response = await this.appService.supplierSignUpAsync(supplier);
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
    }

    supplierSignIn = async (supplierName: string, password: string) => {
        try {
            const response = await this.appService.supplierSignInAsync(
                supplierName,
                password
            );
            if (response.loginOk) {
                this.currentSupplier = response.supplierProfile; // TODO: check if return type is userprofile
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
    }

    addFood = async (food: FoodType) => {
        try {
            const response = await this.appService.addFoodAsync(food);
            if (response.isOk) {
                this.uiState.setSuccess(`${food.foodName} has been successfully added!`);

                // todo: update food page when food added

            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    }

    addVoucher = async (voucher: VoucherType) => {
        try {
            const response = await this.appService.addVoucherAsync(voucher);
            if (response.isOk) {
                this.uiState.setSuccess(`${voucher.name} has been successfully added!`);

            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    }

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
            const restaurantList = await this.appService.getRestaurants();

            // runInAction is required to update observable
            runInAction(() => (this.restaurantList = [...restaurantList]));
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

    // @action
    setFriendList = (list: UserType[]) => {
        this.friendList = list;
    };

    getAllRestaurants() {
        return this.restaurantList;
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
            supplierName: supplierName ? supplierName : this.currentSupplier.supplierName,
            supplierEmail: supplierEmail ? supplierEmail : this.currentSupplier.supplierEmail,
            supplierPassword: supplierPassword ? supplierPassword : this.currentSupplier.supplierPassword,
            supplierWalletAddress: supplierWalletAddress ? supplierWalletAddress : this.currentSupplier.supplierWalletAddress,
            supplierAddress: supplierAddress ? supplierAddress : this.currentSupplier.supplierAddress,
        }
    }

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

    buyFood = async (foodId: string) => {
        try {
            this.uiState.setIsLoading(true);
            // Interacts with the borrow media method in the contract
            const tx: ContractTransaction = await this.appService.buyFoodAsync(
                foodId
            );
            await tx.wait();
            const tokenId = (
                await this.appService.getLastTokenId(
                    this.currentUser.userWalletAddress
                )
            ).toNumber();
            this.uiState.setIsLoading(false);
            console.log('Token id', tokenId);
            this.uiState.setSuccess('Successfully bought ' + foodId);
            console.log('Successfully bought' + foodId);
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

            for (let token of tokenList) {
                const foodID = this.appService.getFoodIDAsync(token);
                console.log(foodID);
                foodIdList.push(foodID);
                // const foodData = await this.appService.getFood(foodID);
                // foodList.push(foodData);
            }
            foodIdList = await Promise.all(foodIdList);
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

    gift = async (
        receiverAddress: string,
        foodId: string,
        buyRequired: boolean
    ) => {
        try {
            this.uiState.setIsLoading(true);
            let tokenId = -1;
            if (!buyRequired) {
                tokenId = this.myFoodList.findIndex((food) => {
                    return food._id == foodId;
                });
                tokenId = this.myTokenList[tokenId];
            }
            console.log(`${foodId} tokenid is ${tokenId}`);
            const tx2: ContractTransaction = await this.appService.giftAsync(
                receiverAddress,
                foodId,
                buyRequired,
                tokenId
            );

            await tx2.wait();
            this.uiState.setIsLoading(false);
            this.uiState.setSuccess(
                `Successfully transferred ${foodId} to ${receiverAddress}`
            );
            console.log(
                `Successfully transferred ${foodId} to ${receiverAddress}`
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
