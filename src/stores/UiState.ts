import { observable, action, makeObservable } from 'mobx';

/**
 * MobX store to manage UI states among components
 */

interface UiState {
    signUpModalOpen: boolean;
    friendsDrawerOpen: boolean;
    addFriendsModalOpen: boolean;
    giftModalOpen: boolean;

    error: string;
    success: string;
    isLoading: boolean;
}

class UiState {
    signUpModalOpen: boolean = false;
    friendsDrawerOpen: boolean = false;
    addFriendsModalOpen: boolean = false;
    giftModalOpen: boolean = false;

    error = '';
    success = '';
    isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
            signUpModalOpen: observable,
            friendsDrawerOpen: observable,
            addFriendsModalOpen: observable,
            giftModalOpen: observable,
            error: observable,
            success: observable,
            isLoading: observable,

            setSignUpModalOpen: action,
            setFriendsDrawerOpen: action,
            setAddFriendsModalOpen: action,
            setGiftModalOpen: action,
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
