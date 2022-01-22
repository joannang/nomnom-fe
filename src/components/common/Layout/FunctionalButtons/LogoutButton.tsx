import * as React from 'react';
import styles from '../ContentLayout.module.css';
import { FaSignOutAlt, FaUserFriends } from 'react-icons/fa';
import { Button } from 'antd';
import { useStores } from '../../../../stores/StoreProvider';
import { observer } from 'mobx-react';

const LogoutButton: React.FC = () => {

    const LogoutIcon = () => (
        <div className={styles.iconWrapper}>
            <FaSignOutAlt />
        </div>
    );

    const logout = () => {
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('food');
        window.location.href = '/login';
    };

    return (
        <div className={styles.logoutBtnContainer}>
            <Button
                data-testid="profile-button"
                type="primary"
                className={styles.profileBtn}
                shape="circle"
                icon={<LogoutIcon />}
                onClick={logout}
            />
        </div>
    );
};

export default observer(LogoutButton);
