import * as React from 'react';
import FriendsButton from './FriendsButton';
import LogoutButton from './LogoutButton';
import NotificationsBell from './NotificationsBell';
import WalletInfo from './WalletInfo';

const FunctionalButtons: React.FC = () => {
    return (
        <>
            <WalletInfo />
            <NotificationsBell />
            <FriendsButton />
            <LogoutButton />
        </>
    );
};

export default FunctionalButtons;
