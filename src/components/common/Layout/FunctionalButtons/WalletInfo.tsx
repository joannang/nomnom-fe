import * as React from 'react';
import styles from '../ContentLayout.module.css';
import { FaUserFriends } from 'react-icons/fa';
import { Button } from 'antd';
import { useStores } from '../../../../stores/StoreProvider';
import { observer } from 'mobx-react';
import { Tag } from 'antd';

const WalletInfo: React.FC = () => {
    const { walletStore } = useStores();

    return (
        <div className={styles.tagDiv}> 
            <Tag className={styles.tag} color="volcano">{walletStore.walletAddress}</Tag>
        </div>
    );
};

export default observer(WalletInfo);
