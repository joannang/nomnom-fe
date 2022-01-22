import { ethers, Contract, ContractTransaction } from 'ethers';
import {
    JsonRpcProvider,
    Web3Provider,
    JsonRpcSigner,
} from '@ethersproject/providers';
import { ENDPOINT } from '../settings';
import restGet from '../lib/restGet';
import restPost from '../lib/restPost';
import { UserType } from './AppStore';
import { MARKET_ADDRESS} from '../settings';
import Library from '../../ethereum/artifacts/contracts/Market.sol/Market.json';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface AppService {
    provider: JsonRpcProvider | Web3Provider; // ethers provider
    signer: JsonRpcSigner;
    factory: Contract; // factory contract instance
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

    getFood(foodID: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + '/food/' + foodID,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
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
    };

    getReceivedGiftsAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/receivedGifts/${walletAddress}`,
                })
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        })
    }

    getBuyProgressAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/buyprogress/${walletAddress}`,
                })
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        })
    }

    sentGiftsProgressAsync(walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/sentGifts/${walletAddress}`,
                })
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        })
    }

    async getLastTokenId(walletAddress: string) {
        return this.factory.connect(this.signer).lastTokenID(walletAddress);
    }

    async buyFoodAsync(foodId: string): Promise<ContractTransaction> {
        return this.factory.connect(this.signer).buy(foodId, { value: ethers.utils.parseUnits("17", "gwei") });
    }

    async getMommomsAsync(): Promise<any> {
        return this.factory.connect(this.signer).getCustomerMommomsToken();
    }

    async getLastTokenListAsync(): Promise<any> {
        return this.factory.connect(this.signer).getLastTokenList();
    }

    async getFoodIDAsync(tokenId: number): Promise<any> {
        return this.factory.connect(this.signer).getFoodID(tokenId);
    }

    async giftAsync(receiverAddress: string, foodId: string): Promise<any> {
        return this.factory.connect(this.signer).buyAndGift(foodId,receiverAddress, { value: ethers.utils.parseUnits("170", "gwei") });
    }
}

export default AppService;
