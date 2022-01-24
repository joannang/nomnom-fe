import {
    FrownOutlined,
    SendOutlined,
} from '@ant-design/icons';
import { Button, Modal, Result, Select, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { FoodType } from '../../../stores/AppStore';
import { useStores } from '../../../stores/StoreProvider';
import styles from './GiftModal.module.css';

const GiftModal: React.FC<{ buyRequired: boolean }> = ({ buyRequired }) => {
    const { appStore, uiState } = useStores();

    const [walletAddress, setWalletAddress] = useState('');
    const [friendName, setFriendName] = useState('');
    let food: FoodType;
    let foodId: string;
    try {
        food = JSON.parse(sessionStorage.getItem('food'))
        foodId = food ? food._id : "-1";
    } catch {

    }
    
    const user = JSON.parse(sessionStorage.getItem('user'));
    const friends = user.friends.confirmed;

    const { Title } = Typography;
    const { Option } = Select;

    const handleSendGift = async () => {
        uiState.setGiftModalOpen(false);
        if (walletAddress.length < 2) {
            uiState.setError("No friend selected!")
            return;
        }
        try {
            if (uiState.giftType == 'food') {
                await appStore.gift(walletAddress, foodId, food.foodName, friendName, buyRequired);
            } else { // voucher
                // TODO: add gift voucher logic
            }
            
        } catch (err) {
            console.log(err)
        }
    };

    const handleWalletAddress = (_, option) => {
        setWalletAddress(option.value);
        setFriendName(option.children);
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
                Gift this {uiState.giftType} to a friend
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
