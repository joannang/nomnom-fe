import * as React from 'react';
import FriendsButton from './FriendsButton';
import LogoutButton from './LogoutButton';
import NotificationsBell from './NotificationsBell';

const FunctionalButtons: React.FC = () => {
    return (
        <>
            <NotificationsBell />
            <FriendsButton />
            <LogoutButton />
        </>
    );
};

export default FunctionalButtons;
