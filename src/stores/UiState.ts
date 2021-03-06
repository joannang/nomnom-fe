import { observable, action, makeObservable } from 'mobx';

/**
 * MobX store to manage UI states among components
 */

interface UiState {
    signUpModalOpen: boolean;
    friendsDrawerOpen: boolean;
    addFriendsModalOpen: boolean;
    giftModalOpen: boolean;
    supplierSignUpModalOpen: boolean;
    addFoodModalOpen: boolean;
    addVoucherModalOpen: boolean;
    redemptionModalOpen: boolean;
    giftType: string;

    error: string;
    success: string;
    isLoading: boolean;
}

class UiState {
    signUpModalOpen: boolean = false;
    friendsDrawerOpen: boolean = false;
    addFriendsModalOpen: boolean = false;
    giftModalOpen: boolean = false;
    supplierSignUpModalOpen: boolean = false;
    addFoodModalOpen: boolean = false;
    addVoucherModalOpen: boolean = false;
    redemptionModalOpen: boolean = false;
    giftType: string = 'food';

    error = '';
    success = '';
    isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
            signUpModalOpen: observable,
            friendsDrawerOpen: observable,
            addFriendsModalOpen: observable,
            giftModalOpen: observable,
            supplierSignUpModalOpen: observable,
            addFoodModalOpen: observable,
            addVoucherModalOpen: observable,
            redemptionModalOpen: observable,
            giftType: observable,
            error: observable,
            success: observable,
            isLoading: observable,

            setSignUpModalOpen: action,
            setFriendsDrawerOpen: action,
            setAddFriendsModalOpen: action,
            setGiftModalOpen: action,
            setSupplierSignUpModalOpen: action,
            setAddFoodModalOpen: action,
            setAddVoucherModalOpen: action,
            setRedemptionModalOpen: action,
            setGiftType: action,
            setError: action,
            setSuccess: action,
            setIsLoading: action,
        });
    }

    // @action
    setSignUpModalOpen = (open: boolean) => {
        this.signUpModalOpen = open;
    };

    // @action
    setFriendsDrawerOpen = (open: boolean) => {
        this.friendsDrawerOpen = open;
    };

    // @action
    setAddFriendsModalOpen = (open: boolean) => {
        this.addFriendsModalOpen = open;
    };

    // @action
    setGiftModalOpen = (open: boolean) => {
        this.giftModalOpen = open;
    }

    // @action
    setSupplierSignUpModalOpen = (open: boolean) => {
        this.supplierSignUpModalOpen = open;
    }

    setAddFoodModalOpen = (open: boolean) => {
        this.addFoodModalOpen = open;
    }

    setAddVoucherModalOpen = (open: boolean) => {
        this.addVoucherModalOpen = open;
    }
    
    setRedemptionModalOpen = (open: boolean) => {
        this.redemptionModalOpen = open;
    }

    setGiftType = (type: string) => {
        this.giftType = type;
    }

    setError = (error: string) => {
        this.error = error;
    };

    setSuccess = (success: string) => {
        this.success = success;
    };

    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    }
}

export default UiState;
