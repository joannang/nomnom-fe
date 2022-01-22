/* eslint-disable react-hooks/rules-of-hooks */
import { Input, Modal, Select, Typography } from 'antd';
import { useMediaQuery } from 'beautiful-react-hooks';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useState } from 'react';
import { UserType } from '../../../stores/AppStore';
import { useStores } from '../../../stores/StoreProvider';
import styles from './AddFriendsModal.module.css';

const AddFriendsModal: React.FC = () => {
    const { uiState, appStore } = useStores();

    const { Title } = Typography;

    const [input, setInput] = useState('');

    const handleAddFriend = async() => {

        const user: UserType = JSON.parse(sessionStorage.getItem('user'));
        const username = user.userName;

        if (!input) {
            uiState.setError(`Please key in an input`);
            return;
        }

        try {
            await appStore.sendFriendRequest(username, input);
            uiState.setAddFriendsModalOpen(false);
            uiState.setFriendsDrawerOpen(false);
        } catch (err) {
            console.log(err.message)
        }
    };

    return (
        <Modal
            visible={uiState.addFriendsModalOpen}
            onCancel={() => uiState.setAddFriendsModalOpen(false)}
            onOk={handleAddFriend}
            okText={'Add'}
        >
            <Title level={3} className={styles.title}>
                Add a friend
            </Title>
            <Input
                placeholder={`Enter email/username of friend`}
                onChange={(e) => setInput(e.target.value)}
            />
        </Modal>
    );
};

export default observer(AddFriendsModal);
