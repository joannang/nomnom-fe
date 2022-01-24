import { ethers, Contract, ContractTransaction } from 'ethers';
import {
    JsonRpcProvider,
    Web3Provider,
    JsonRpcSigner,
} from '@ethersproject/providers';
import { ENDPOINT } from '../settings';
import restGet from '../lib/restGet';
import restPost from '../lib/restPost';
import {
    FoodType,
    RestaurantType,
    SupplierType,
    UserType,
    VoucherType,
} from './AppStore';
import { MARKET_ADDRESS, SUPPLIER_ADDRESS } from '../settings';
import Library from '../../ethereum/artifacts/contracts/Market.sol/Market.json';
import Supplier from '../../ethereum/artifacts/contracts/Supplier.sol/Supplier.json';
import axios from 'axios';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface AppService {
    provider: JsonRpcProvider | Web3Provider; // ethers provider
    signer: JsonRpcSigner;
    factory: Contract; // factory contract instance
    supplierContract: Contract;
}

/**
 * AppService - abstractor class to interact with Ethereum chain via Infura API.
 * Can be deployed to server backend without requiring users to install FE wallets like Metamask
 *
 * Reference for connecting to endpoint with ethers:
 * https://blog.infura.io/ethereum-javascript-libraries-web3-js-vs-ethers-js-part-ii/#section-6-ethers
 *
 */
class AppService {
    constructor() {
        if (
            typeof window !== 'undefined' &&
            typeof window.ethereum !== 'undefined'
        ) {
            // We are in the browser and metamask is running.
            window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner(0);
        } else {
            // We are on the server *OR* the user is not running metamask
        }

        this.factory = new ethers.Contract(
            MARKET_ADDRESS,
            Library.abi,
            this.provider
        );

        this.supplierContract = new ethers.Contract(
            SUPPLIER_ADDRESS,
            Supplier.abi,
            this.provider
        );
    }

    //
    signUpAsync(user: UserType): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    userName: user.userName,
                    userPassword: user.userPassword,
                    userEmail: user.userEmail,
                    userWalletAddress: user.userWalletAddress,
                    userDeliveryAddress: user.userDeliveryAddress,
                };

                const response = await restPost({
                    endpoint: ENDPOINT + '/signup',
                    data: data,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    // user id can be either username or email
    signInAsync(userId: string, password: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    userId: userId,
                    userPassword: password,
                };
                const response = await restPost({
                    endpoint: ENDPOINT + '/signin',
                    data: data,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    supplierSignUpAsync(supplier: SupplierType): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data: SupplierType = {
                    supplierName: supplier.supplierName,
                    supplierPassword: supplier.supplierPassword,
                    supplierEmail: supplier.supplierEmail,
                    supplierWalletAddress: supplier.supplierWalletAddress,
                    supplierAddress: supplier.supplierAddress,
                };

                const response = await restPost({
                    endpoint: ENDPOINT + '/supplier/signup',
                    data: data,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    supplierSignInAsync(supplierName: string, password: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    supplierName: supplierName,
                    supplierPassword: password,
                };
                const response = await restPost({
                    endpoint: ENDPOINT + '/supplier/signin',
                    data: data,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    async addFoodAsync(food: FoodType): Promise<any> {
        //const result = await this.supplierContract.connect(this.signer).listFood(string foodName, food.restaurantName, int price in wei)
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: ENDPOINT + '/supplier/food',
                    data: food,
                });
                console.log('response', response.data);
                await this.supplierContract
                    .connect(this.signer)
                    .listFood(
                        response.data.foodData._id,
                        food.restaurantName,
                        response.data.foodData.foodPrice
                    );
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    addVoucherAsync(voucher: VoucherType): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: ENDPOINT + '/supplier/voucher',
                    data: voucher,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    getVouchersAsync(restaurantName: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/voucher/${restaurantName}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    createRestaurantAsync(restaurant: RestaurantType): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: ENDPOINT + '/restaurants',
                    data: restaurant,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    async buyAndRedeemBooster(tier: number) {
        await this.supplierContract
            .connect(this.signer)
            .buyBooster(tier.toString(), {
                value: ethers.utils.parseUnits('17', 'gwei'),
            });
        return this.supplierContract
            .connect(this.signer)
            .redeemBooster(tier.toString(), {
                gasLimit: 1000000,
            });
    }

    // recipient: can be username, email, wallet addr
    sendFriendRequestAsync(username: string, recipient: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    userId: username,
                    receiver: recipient,
                };
                const response = await restPost({
                    endpoint: ENDPOINT + '/friendrequest',
                    data: data,
                });

                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    getFoods(restaurantName: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + '/restaurant/' + restaurantName,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    // // Old version
    // getFood(foodID: string): any {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const response = await restGet({
    //                 endpoint: ENDPOINT + '/food/' + foodID,
    //             });
    //             resolve(response.data);
    //         } catch (err) {
    //             reject(err.message);
    //         }
    //     });
    // }

    async getFood(foodIDs: any): Promise<any> {
        const requests = [];
        for (let foodId of foodIDs) {
            const request = restGet({
                endpoint: ENDPOINT + '/food/' + foodId,
            });
            requests.push(request);
        }
        const allResponses = await axios.all(requests);
        const result = [];
        for (let response of allResponses) {
            if (response.hasOwnProperty('data') && response.data) {
                result.push(response.data);
            }
        }
        return result;
    }

    respondToFriendRequestAsync(
        senderUserName: string,
        receiverUserName: string,
        isAccepted: boolean
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    senderUserName: senderUserName,
                    receiverUserName: receiverUserName,
                    isAccepted: isAccepted,
                };
                const response = await restPost({
                    endpoint: ENDPOINT + '/friendrequest/response',
                    data: data,
                });

                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    getRestaurants(): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + '/restaurants',
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    getReceivedGiftsAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/receivedGifts/${walletAddress}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    getBuyProgressAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/buyprogress/${walletAddress}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    sentGiftsProgressAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/sentGifts/${walletAddress}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    getCurrentAvailableNomnomsAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/nomnombalance/${walletAddress}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        })
    }

    async getLastTokenId(walletAddress: string) {
        return this.factory.connect(this.signer).lastTokenID();
    }

    async buyFoodAsync(
        foodId: string,
        price: number
    ): Promise<ContractTransaction> {
        price = Math.floor((price * 1038114374) / 3300);
        return this.factory.connect(this.signer).buyFood(foodId, {
            value: ethers.utils.parseUnits(price.toString(), 'gwei'),
            gasLimit: 2500000,
        });
    }

    async getNomnomsAsync(): Promise<any> {
        return this.factory.connect(this.signer).getCustomerMommomsToken();
    }

    async getLastTokenListAsync(): Promise<any> {
        const result = await this.factory
            .connect(this.signer)
            .getCustomerFoods();
        console.log('customerfoods', result);
        return result;
        //return this.factory.connect(this.signer).getLastTokenList();
    }

    async getFoodIDAsync(tokenId: number): Promise<any> {
        return this.factory.connect(this.signer).getFoodID(tokenId);
    }

    async giftAsync(
        receiverAddress: string,
        foodId: string,
        price: number,
        buyRequired: boolean,
        tokenId: number
    ): Promise<any> {
        price = Math.floor((price * 1038114374) / 3300);
        if (buyRequired) {
            return this.factory
                .connect(this.signer)
                .buyAndGiftFood(foodId, receiverAddress, {
                    value: ethers.utils.parseUnits(price.toString(), 'gwei'),
                });
        } else {
            return this.factory
                .connect(this.signer)
                .giftFood(receiverAddress, tokenId);
        }
    }

    async redeemFood(tokenId: number) {
        return this.factory.connect(this.signer).redeemFood(tokenId);
    }

    async getLoyaltyStatus(userAddress: string, restaurantName: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint:
                        ENDPOINT + `/loyalty/${userAddress}/${restaurantName}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }
}

export default AppService;
