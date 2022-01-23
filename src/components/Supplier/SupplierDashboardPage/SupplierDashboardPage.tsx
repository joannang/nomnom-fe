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
import { VoucherType } from '../../../stores/AppStore';

const foodPerRow = 3;

const SupplierDashboardPage: React.FC = () => {
    const { appStore, uiState } = useStores();

    const { Title } = Typography;
    const { TabPane } = Tabs;

    const foodList = appStore.getFoodList(); 

    React.useEffect(() => {
        // get the restaurant's food items
        getFoodList();
        appStore.getFoodList();
    }, []);

    const getFoodList = async() => {
        await appStore.setFoodList(name);
    }

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    const name = supplier.supplierName;

    const vouchers: VoucherType[] = [
        {
            _id: 1,
            name: 'Starbucks 1 ETH OFF',
            supplierName: 'Starbucks',
            value: 1, // in eth
            expiryDate: new Date().toString(),
        },
        {
            _id: 2,
            name: 'Starbucks 2 ETH OFF',
            supplierName: 'Starbucks',
            value: 2, // in eth
            expiryDate: new Date().toString(),
        },
        {
            _id: 3,
            name: 'Starbucks 0.2 ETH OFF',
            supplierName: 'Starbucks',
            value: 0.2, // in eth
            expiryDate: new Date().toString(),
        },
        {
            _id: 4,
            name: 'Starbucks 0.5 ETH OFF',
            supplierName: 'Starbucks',
            value: 0.5, // in eth
            expiryDate: new Date().toString(),
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

export default checkAuthenticated(observer(SupplierDashboardPage));