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

    let name = '';

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    if (supplier) { 
        name = supplier.supplierName;
    }

    appStore.getFoodList();

    React.useEffect(() => {
        // get the restaurant's food items
        getData();
    }, []);

    const getData = async () => {
        await appStore.setFoodList(name);
        await appStore.getVouchers(name);
    };

    const columns = [
        {
            title: 'Value',
            dataIndex: 'value',
            render: (text) => <span>{text} ETH</span>,
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
        },
    ];

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
            {spliceList(appStore.foodList).map((row, idx) => {
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

    const VouchersTab = observer(() => (
        <>
            <Button
                icon={<PlusOutlined />}
                onClick={() => uiState.setAddVoucherModalOpen(true)}
            >
                Add Voucher
            </Button>
            <br />
            <br />
            <Table
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                dataSource={appStore.voucherList}
                columns={columns}
                className={styles.table}
            />
        </>
    ));

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
                <Tabs defaultActiveKey="1" className={styles.tabs}>
                    <TabPane tab="My Menu" key="1">
                        <MenuTab />
                    </TabPane>
                    <TabPane tab="My Vouchers" key="2">
                        <VouchersTab />
                    </TabPane>
                </Tabs>
            </div>
            <AddFoodModal />
            <AddVoucherModal />
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(SupplierDashboardPage));
