import * as React from 'react';
import { useEffect } from 'react';
import { FireOutlined, HeartFilled, PlusSquareOutlined, SendOutlined, SyncOutlined } from '@ant-design/icons';
import { PageHeader, Button, Row, Col, Typography, Tag, Popover } from 'antd';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import ContentLayout from '../common/Layout/ContentLayout';
import FoodCard from './FoodCard';
import checkAuthenticated from '../../security/checkAuthenticated';
import styles from './FoodCard.module.css';
import { Content } from 'antd/lib/layout/layout';

const moviesPerRow = 3;

const MyFoodPage: React.FC = () => {
    const { appStore } = useStores();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const walletaddress = user.userWalletAddress;

    React.useEffect(() => {
        appStore.setMyFoodList(appStore.currentUser.userWalletAddress);
        getFoodProg();
    }, []);

    const getFoodProg = async () => {
        console.log(walletaddress);
        await appStore.getBuyProgress(walletaddress);
        await appStore.getSentProgress(walletaddress);
        await appStore.getReceivedGifts(walletaddress);
    };

    const mommonsList = appStore.getmyFoodList();
    console.log(mommonsList);

    const spliceList = (list) => {
        // Returns a nested array splice into rows of 3 cols
        let splicedList = [],
            row = [];
        for (let idx = 0; idx < list.length; idx++) {
            row.push(list[idx]);
            if (
                (idx != 0 && (idx + 1) % moviesPerRow == 0) ||
                idx == list.length - 1
            ) {
                splicedList.push(row);
                row = [];
            }
        }
        return splicedList;
    };

    return (
        <ContentLayout data-testid="menu-page" title={'Mommom'}>
            <PageHeader
                className={styles.title}
                title={`Hi ${user.userName}!`}
                tags={
                    <Popover
                        placement="right"
                        content="Buy more mommoms to ascend to the next tier!"
                    >
                        <Tag color={appStore.buyCount <= 5 ? 'brown' : 'grey'}>
                            {appStore.buyCount <= 5 ? 'Bronze' : 'Silver'}
                        </Tag>
                    </Popover>
                }
            >
                <Content>
                    <Typography.Title level={5} style={{ color: 'grey' }}>
                        <>
                            <HeartFilled/>&nbsp;
                            {`You have ${
                                (appStore.buyCount - appStore.sentCount == 0)
                                    ? 'no'
                                    : appStore.buyCount - appStore.sentCount
                            } mommom currently :)`}
                            <br />
                            <SendOutlined/>
                            &nbsp;
                            {`You've received ${
                                appStore.receivedCount == 0
                                    ? 'no'
                                    : appStore.receivedCount
                            } mommoms & gifted ${
                                appStore.sentCount == 0
                                    ? 'no'
                                    : appStore.sentCount
                            } mommoms`}
                        </>
                    </Typography.Title>
                </Content>
            </PageHeader>
            <div className={styles.container}>
                {spliceList(mommonsList).map((row, idx) => {
                    // display 3 cols per row for > xs screen
                    return (
                        <Row gutter={[2, 2]} key={idx}>
                            {row.map((food) => (
                                <FoodCard key={food._id + idx} food={food} />
                            ))}
                        </Row>
                    );
                })}
            </div>
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(MyFoodPage));
