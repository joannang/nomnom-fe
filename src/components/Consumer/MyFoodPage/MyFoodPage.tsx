import * as React from 'react';
import { HeartFilled, SendOutlined } from '@ant-design/icons';
import { PageHeader, Row, Typography, Tag, Popover } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../stores/StoreProvider';
import ContentLayout from '../../common/Layout/ContentLayout';
import FoodCard from './FoodCard';
import checkAuthenticated from '../../../security/checkAuthenticated';
import styles from './FoodCard.module.css';
import { Content } from 'antd/lib/layout/layout';
import GiftModal from '../GiftModal'
import RedemptionModal from './RedemptionModal';

const moviesPerRow = 3;

const MyFoodPage: React.FC = () => {
    const { appStore } = useStores();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const walletaddress = user.userWalletAddress;

    React.useEffect(() => {
        getFoodProg();
        appStore.setMyFoodList();
        
    }, []);

    const getFoodProg = async () => {
        await appStore.getBuyProgress(walletaddress);
        await appStore.getSentProgress(walletaddress);
        await appStore.getReceivedGifts(walletaddress);
        await appStore.getAvailableNomnoms(walletaddress);
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
        <ContentLayout data-testid="menu-page" title={'Nomnom'}>
            <PageHeader
                className={styles.title}
                title={`Hi ${user.userName}!`}
                tags={
                    <Popover
                        placement="right"
                        content="Buy more nomnoms to ascend to the next tier!"
                    >
                        <Tag color={appStore.buyCount <= 5 ? 'brown' : appStore.buyCount <= 10 ? 'grey' : 'gold'}>
                            {appStore.buyCount <= 5  ? 'Bronze' : appStore.buyCount <= 10 ? 'Silver' : 'Gold'}
                        </Tag>
                    </Popover>
                }
            >
                <Content>
                    <Typography.Title level={5} style={{ color: 'grey' }}>
                        <>
                            <HeartFilled/>&nbsp;
                            {`You have ${
                                (appStore.availableCount == 0)
                                    ? 'no'
                                    : appStore.availableCount
                            } nomnoms currently :)`}
                            <br />
                            <SendOutlined/>
                            &nbsp;
                            {`You've received ${
                                appStore.receivedCount == 0
                                    ? 'no'
                                    : appStore.receivedCount
                            } nomnoms & gifted ${
                                appStore.sentCount == 0
                                    ? 'no'
                                    : appStore.sentCount
                            } nomnoms`}
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
                                <FoodCard key={food._id + idx} food={food} tokenIdx={idx} />
                            ))}
                        </Row>
                    );
                })}
            </div>
            <GiftModal buyRequired={false} />
            <RedemptionModal/>
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(MyFoodPage));
