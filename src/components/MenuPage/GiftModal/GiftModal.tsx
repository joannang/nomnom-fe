import {
    FrownOutlined,
    QuestionCircleOutlined,
    SendOutlined,
} from '@ant-design/icons';
import { Button, Modal, Result, Select, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import AppStore from '../../../stores/AppStore';
import { useStores } from '../../../stores/StoreProvider';
import styles from './GiftModal.module.css';

const GiftModal: React.FC = () => {
    const { appStore, uiState } = useStores();

    const [walletAddress, setWalletAddress] = useState('');

    const foodId = sessionStorage.getItem('food');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const ownAddr = user.userWalletAddress;
    const friends = user.friends.confirmed;

    const { Title } = Typography;
    const { Option } = Select;

    const handleSendGift = async () => {
        try {
            await appStore.gift(walletAddress, foodId);
            uiState.setGiftModalOpen(false);
        } catch (err) {
            console.log(err)
        }
    };

    const handleWalletAddress = value => {
        setWalletAddress(value);
    }

    return (
        <Modal
            visible={uiState.giftModalOpen}
            onCancel={() => uiState.setGiftModalOpen(false)}
            onOk={() => handleSendGift()}
            okText={
                <span>
                    <SendOutlined /> Send
                </span>
            }
        >
            <Title level={3} className={styles.title}>
                Gift this food to a friend
            </Title>
            {friends.length > 0 ? (
                <Select
                    onChange={handleWalletAddress}
                    // defaultValue={friends[0].friendWalletAddress}
                    style={{ width: '100%' }}
                >
                    {friends.map((friend, idx) => (
                        <Option key={idx} value={friend.friendWalletAddress}>
                            {friend.friendUserName}
                        </Option>
                    ))}
                </Select>
            ) : (
                <Result
                    icon={<FrownOutlined />}
                    title="You don't have any friends currently..."
                    extra={
                        <Button
                            onClick={() => {
                                uiState.setGiftModalOpen(false);
                                uiState.setAddFriendsModalOpen(true);
                            }}
                        >
                            Add friends here!
                        </Button>
                    }
                />
            )}
        </Modal>
    );
};

export default observer(GiftModal);
