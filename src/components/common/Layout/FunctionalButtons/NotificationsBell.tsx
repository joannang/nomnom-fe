import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from '../ContentLayout.module.css';
import { Badge, Button, Dropdown, Menu, Space } from 'antd';
import { useStores } from '../../../../stores/StoreProvider';
import { observer } from 'mobx-react';
import { FaBell } from 'react-icons/fa';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const NotificationsBell: React.FC = () => {
    const { uiState, appStore } = useStores();
    const [hasNotifications, setHasNotifications] = useState(false);
    const [visible, setVisible] = useState(false)

    const user = JSON.parse(sessionStorage.getItem('user'));
    var pendingList = user.friends.pending;

    const getUserDetails = async () => {
        await appStore.signIn(user.userName, user.userPassword);

        const updatedUser = JSON.parse(sessionStorage.getItem('user'));
        pendingList = updatedUser.friends.pending;
        if (pendingList.length > 0) setHasNotifications(true);
    };

    useEffect(() => {
        getUserDetails();
    });

    const respondRequest = async (friendUserName: any, isAccepted: boolean) => {
        try {
            await appStore.respondToFriendRequest(
                friendUserName,
                user.userName,
                isAccepted
            );
            setVisible(false);
            uiState.setSuccess('Operation successful!')
        } catch (err) {
            console.log(err.message)
        };
    };

    const BellIcon = () => (
        <div className={styles.iconWrapper}>
            <FaBell onClick={() => setVisible(true)}/>
        </div>
    );

    const Notifications = (
        <>
            {hasNotifications && (
                <Menu>
                    {pendingList.map((friend, idx) => (
                        <Menu.Item key={idx}>
                            {console.log(friend)}
                            <span>
                                {`${friend.friendUserName} has sent you a friend request owo!`}
                                &nbsp;
                            </span>
                            <Space>
                                <Button
                                    style={{ color: 'green' }}
                                    icon={<CheckOutlined />}
                                    onClick={() => respondRequest(friend.friendUserName, true)}
                                />
                                <Button
                                    style={{ color: 'red' }}
                                    icon={<CloseOutlined />}
                                    onClick={() =>
                                        respondRequest(friend.friendUserName, false)
                                    }
                                />
                            </Space>
                        </Menu.Item>
                    ))}
                </Menu>
            )}
        </>
    );

    return (
        <div className={styles.notifBellContainer}>
            <Dropdown visible={visible} overlay={Notifications}>
                <Badge dot={hasNotifications}>
                    <Button
                        data-testid="profile-button"
                        type="primary"
                        className={styles.profileBtn}
                        shape="circle"
                        icon={<BellIcon />}
                    />
                </Badge>
            </Dropdown>
        </div>
    );
};

export default observer(NotificationsBell);
