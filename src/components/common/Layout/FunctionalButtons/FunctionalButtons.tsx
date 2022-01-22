import * as React from 'react';
import FriendsButton from './FriendsButton';
import LogoutButton from './LogoutButton';
import NotificationsBell from './NotificationsBell';

type IProps = {
    isSupplier: boolean;
};

const FunctionalButtons: React.FC<IProps> = (props) => {
    return (
        <>
            {!props && (
                <>
                    <NotificationsBell />
                    <FriendsButton />
                </>
            )}

            <LogoutButton />
        </>
    );
};

export default FunctionalButtons;
