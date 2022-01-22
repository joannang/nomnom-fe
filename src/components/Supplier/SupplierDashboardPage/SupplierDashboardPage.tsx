import * as React from 'react';
import { useEffect } from 'react';
import {
    PlusOutlined,
    PlusSquareOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { PageHeader, Button, Row, Col, Typography, Tabs, Table } from 'antd';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../stores/StoreProvider';
import ContentLayout from '../../common/Layout/ContentLayout';
import FoodCard from './FoodCard';
import checkAuthenticated from '../../../security/checkAuthenticated';
import styles from './FoodCard.module.css';
import AddFoodModal from './AddFoodModal';
import AddVoucherModal from './AddVoucherModal';

const foodPerRow = 3;

const SupplierDashboardPage: React.FC = () => {
    const { appStore, uiState } = useStores();

    const { Title } = Typography;
    const { TabPane } = Tabs;

    React.useEffect(() => {
        // get the restaurant's food items
    }, []);

    // const foodList = appStore.getFoodList(); // TODO: get all of restaurant's food

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    // const name = supplier.supplierName;
    const name = 'Starbucks'; // TODO: hardcoded, delete later

    // fake data
    const foodList = [
        {
            _id: 1,
            foodImageUrl:
                'https://d1sag4ddilekf6.azureedge.net/compressed/items/SGITE20220104161208026873/photo/d4872fc1_Frappuccino.jpg',
            foodName: 'test food',
            foodPrice: '3.30',
            foodDescription: 'test',
        },
        {
            _id: 2,
            foodImageUrl:
                'https://d1sag4ddilekf6.azureedge.net/compressed/items/SGITE20220104161203016469/photo/d65ddb89_OnGreen06.jpg',
            foodName: 'test food 2',
            foodPrice: '3.50',
            foodDescription: 'test',
        },
        {
            _id: 3,
            foodImageUrl:
                'https://d1sag4ddilekf6.azureedge.net/compressed/items/SGITE20220104161205021815/photo/c5ca507a_Frappuccino.jpg',
            foodName: 'test food 2',
            foodPrice: '4.50',
            foodDescription: 'test',
        },
    ];

    const vouchers = [
        {
            _id: 1,
            name: 'Starbucks 1 ETH OFF',
            supplierName: 'Starbucks',
            value: '1', // in eth
            expiryDate: new Date(),
        },
        {
            _id: 2,
            name: 'Starbucks 2 ETH OFF',
            supplierName: 'Starbucks',
            value: '2', // in eth
            expiryDate: new Date(),
        },
        {
            _id: 3,
            name: 'Starbucks 0.2 ETH OFF',
            supplierName: 'Starbucks',
            value: '0.2', // in eth
            expiryDate: new Date(),
        },
        {
            _id: 4,
            name: 'Starbucks 0.5 ETH OFF',
            supplierName: 'Starbucks',
            value: '0.5', // in eth
            expiryDate: new Date(),
        }
    ]

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            render: text => <span>{text} ETH</span>
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
        }
    ]

    const spliceList = (list) => {
        // Returns a nested array splice into rows of 3 cols
        let splicedList = [],
            row = [];
        for (let idx = 0; idx < list.length; idx++) {
            row.push(list[idx]);
            if (
                (idx != 0 && (idx + 1) % foodPerRow == 0) ||
                idx == list.length - 1
            ) {
                splicedList.push(row);
                row = [];
            }
        }
        return splicedList;
    };

    const MenuTab = () => (
        <>
            <Button
                icon={<PlusOutlined />}
                onClick={() => uiState.setAddFoodModalOpen(true)}
            >
                Add Item
            </Button>
            {spliceList(foodList).map((row, idx) => {
                // display 3 cols per row for > xs screen
                return (
                    <Row gutter={[2, 2]} key={idx}>
                        {row.map((food) => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </Row>
                );
            })}
        </>
    );

    const VouchersTab = () => (<>
        <Button icon={<PlusOutlined />}
                onClick={() => uiState.setAddVoucherModalOpen(true)}>
            Add Voucher
        </Button>
        <br/><br/>
        <Table dataSource={vouchers} columns={columns} className={styles.table}/>
    </>);

    return (
        <ContentLayout
            data-testid="menu-page"
            title={'Nomnom'}
            isSupplier={true}
        >
            <div className={styles.container}>
                <Title level={3} className={styles.title}>
                    Welcome, {name}
                </Title>
                <Tabs
                    defaultActiveKey="1"
                    className={styles.tabs}
                >
                    <TabPane tab="My Menu" key="1">
                        <MenuTab />
                    </TabPane>
                    <TabPane tab="My Vouchers" key="2">
                        <VouchersTab />
                    </TabPane>
                </Tabs>
            </div>
            <AddFoodModal />
            <AddVoucherModal/>
        </ContentLayout>
    );
};

// export default checkAuthenticated(observer(SupplierDashboardPage));
export default observer(SupplierDashboardPage);
