import * as React from 'react';
import { useEffect } from 'react';
import { PlusOutlined, PlusSquareOutlined, SyncOutlined } from '@ant-design/icons';
import { PageHeader, Button, Row, Col, Typography } from 'antd';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../../stores/StoreProvider';
import ContentLayout from '../../common/Layout/ContentLayout';
import FoodCard from './FoodCard';
import checkAuthenticated from '../../../security/checkAuthenticated';
import styles from './FoodCard.module.css';

const foodPerRow = 3;

const SupplierDashboardPage: React.FC = () => {
    const { appStore } = useStores();

    const { Title } = Typography;

    React.useEffect(() => {
        // get the restaurant's food items
    }, []);

    // const foodList = appStore.getFoodList(); // TODO: get all of restaurant's food

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    // const name = supplier.supplierName;
    const name = 'Starbucks' // TODO: hardcoded, delete later

    // fake data
    const foodList = [
        {
            _id : 1,
            foodImageUrl: 'https://d1sag4ddilekf6.azureedge.net/compressed/items/SGITE20220104161208026873/photo/d4872fc1_Frappuccino.jpg',
            foodName: 'test food',
            foodPrice: '3.30',
            foodDescription: 'test', 
        },
        {
            _id : 2,
            foodImageUrl: 'https://d1sag4ddilekf6.azureedge.net/compressed/items/SGITE20220104161203016469/photo/d65ddb89_OnGreen06.jpg',
            foodName: 'test food 2',
            foodPrice: '3.50',
            foodDescription: 'test', 
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

    return (
        <ContentLayout data-testid="menu-page" title={'Nomnom'} isSupplier={true}>
            <div className={styles.container}>
            <Title level={3} className={styles.title}>
                Welcome, {name}
                &nbsp;&nbsp;
                <Button icon={<PlusOutlined/>} shape='circle' type='link'>Add item</Button>
            </Title>
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
            </div>
        </ContentLayout>
    );
};

// export default checkAuthenticated(observer(SupplierDashboardPage));
export default (observer(SupplierDashboardPage));
