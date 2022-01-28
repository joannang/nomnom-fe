import * as React from 'react';
import { useState } from 'react';
import {
    GiftOutlined,
    PlusSquareOutlined,
    ShopOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import {
    PageHeader,
    Button,
    Row,
    Col,
    Typography,
    Tag,
    Tabs,
    Card,
} from 'antd';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../stores/StoreProvider';
import ContentLayout from '../../common/Layout/ContentLayout';
import MenuCard from './MenuCard';
import checkAuthenticated from '../../../security/checkAuthenticated';
import styles from './MenuCard.module.css';
import GiftModal from '../GiftModal';

const itemsPerRow = 3;

const MenuPage: React.FC = () => {
    const { appStore, uiState } = useStores();
    const [tagColor, setTagColor] = useState('brown');

    const { Title, Text } = Typography;

    var restaurant = window.location.href.split('=')[1];

    React.useEffect(() => {
        appStore.setFoodList(restaurant);
        appStore.getVouchers(restaurant);

        if (appStore.loyaltyStatus == "GOLD") {
            setTagColor('gold'); 
        } else if (appStore.loyaltyStatus == "SILVER") {
            setTagColor('grey');
        } else {
            setTagColor('bronze');
         }
    }, []);

    restaurant = restaurant.replace('%20', ' ');
    restaurant = restaurant.replace('%27', "'");
    appStore.getFoodList();

    appStore.setLoyaltyStatus(appStore.currentUser.userWalletAddress, restaurant);

    const spliceList = (list) => {
        // Returns a nested array splice into rows of 3 cols
        let splicedList = [],
            row = [];
        for (let idx = 0; idx < list.length; idx++) {
            row.push(list[idx]);
            if (
                (idx != 0 && (idx + 1) % itemsPerRow == 0) ||
                idx == list.length - 1
            ) {
                splicedList.push(row);
                row = [];
            }
        }
        return splicedList;
    };

    const FoodTab = () => (
        <>
            {spliceList(appStore.foodList).map((row, idx) => {
                // display 3 cols per row for > xs screen
                return (
                    <Row gutter={[2, 2]} key={idx}>
                        {row.map((food) => (
                            <MenuCard key={food._id} food={food} />
                        ))}
                    </Row>
                );
            })}
        </>
    );

    const handleBuyVoucher = (voucher) => {
        // TODO
    };

    const handleGiftVoucher = (voucher) => {
        uiState.setGiftType('voucher');
        uiState.setGiftModalOpen(true);
    };

    const VoucherCard = ({ voucher }) => (
        <Card hoverable className={styles.card}>
            <div>
                {`${voucher.supplierName} ${voucher.value} ETH OFF`}
                <Button
                    icon={<ShopOutlined />}
                    className={styles.button}
                    onClick={(voucher) => handleBuyVoucher(voucher)}
                />
                <Button
                    icon={<GiftOutlined />}
                    className={styles.button1}
                    onClick={(voucher) => handleGiftVoucher(voucher)}
                />
            </div>
            <small>Expiry: {formatDate(voucher.expiryDate)}</small>
        </Card>
    );

    const VouchersTab = () => (
        <>
            {spliceList(appStore.voucherList).map((row, idx) => {
                return (
                    <Row gutter={[2, 2]} key={idx}>
                        {row.map((voucher) => (
                            <Col xs={24} xl={8} key={voucher._id}>
                                <VoucherCard voucher={voucher}/>
                            </Col>
                        ))}
                    </Row>
                );
            })}
        </>
    );

    const formatDate = (date: string) => {
        return date.substring(25, -1);
    };

    return (
        <ContentLayout data-testid="menu-page" title={'Nomnom'}>
            <div className={styles.container}>
                <Title level={2} className={styles.title}>
                    {restaurant + " "}
                </Title>
                <Text>Loyalty Status: &nbsp;</Text>
                <Tag color={tagColor}>{appStore.loyaltyStatus}</Tag>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Menu" key="1">
                        <FoodTab />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Vouchers" key="2">
                        <VouchersTab />
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <GiftModal buyRequired={true} />
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(MenuPage));
