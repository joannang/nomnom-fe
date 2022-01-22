import * as React from 'react';
import styles from '../ContentLayout.module.css';
import { FaUserFriends } from 'react-icons/fa';
import { Button } from 'antd';
import { useStores } from '../../../../stores/StoreProvider';
import { observer } from 'mobx-react';

const FriendsButton: React.FC = () => {
    const { uiState } = useStores();

    const ProfileIcon = () => (
        <div className={styles.iconWrapper}>
            <FaUserFriends />
        </div>
    );

    return (
        <div className={styles.profileBtnContainer}>
            <Button
                data-testid="profile-button"
                type="primary"
                className={styles.profileBtn}
                shape="circle"
                icon={<ProfileIcon />}
                onClick={() => uiState.setFriendsDrawerOpen(true)}
            />
        </div>
    );
};

export default observer(FriendsButton);
