import { Avatar, Button, Divider, Drawer, List, Row, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../../stores/StoreProvider';

const FriendsPanel: React.FC = () => {
    const { uiState } = useStores();

    const user = JSON.parse(sessionStorage.getItem('user'));

    const onClose = () => {
        uiState.setFriendsDrawerOpen(false);
    };

    const friendsTestList = [
        {
            name: 'Runlin',
            email: 'runlin@email.com',
        },
        {
            name: 'Danzel',
            email: 'danzel@email.com',
        },
        {
            name: 'BiaoYi',
            email: 'by@email.com',
        },
    ];

    type friend = {
        friendUserName: string,
        friendWalletAddress: string,
        friendEmail: string,
    }


    return (
        <Drawer
            mask={uiState.addFriendsModalOpen ? false : true}
            bodyStyle={{ backgroundColor: '#0f1d27', color: '#ccca82' }}
            title="Friends"
            placement="right"
            onClose={onClose}
            visible={uiState.friendsDrawerOpen}
            footer={
                <Button
                    onClick={() => uiState.setAddFriendsModalOpen(true)}
                    block
                >
                    Add more friends
                </Button>
            }
        >
            {/* Friends list */}
            <List
                dataSource={user.friends.confirmed}
                renderItem={(item: friend) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar src="https://avatars.dicebear.com/api/identicon/mommom.svg" />
                            }
                            title={
                                <Typography.Text
                                    style={{ color: '#fff' }}
                                    strong
                                >
                                    {item.friendUserName}
                                </Typography.Text>
                            }
                            description={
                                <small style={{ color: '#ccca82' }}>
                                    {item.friendEmail}
                                </small>
                            }
                        />
                    </List.Item>
                )}
            />
        </Drawer>
    );
};

export default observer(FriendsPanel);
