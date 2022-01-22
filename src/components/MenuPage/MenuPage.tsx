import * as React from 'react';
import { useEffect } from 'react';
import { PlusSquareOutlined, SyncOutlined } from '@ant-design/icons';
import { PageHeader, Button, Row, Col, Typography } from 'antd';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import ContentLayout from '../common/Layout/ContentLayout';
import MenuCard from './MenuCard';
import checkAuthenticated from '../../security/checkAuthenticated';
import styles from './MenuCard.module.css';
import GiftModal from './GiftModal';

const moviesPerRow = 3;

const MenuPage: React.FC = () => {
    const { appStore } = useStores();

    const { Title } = Typography;

    React.useEffect(() => {
        appStore.setFoodList(window.location.href.split('=')[1]);
    }, []);

    const foodList = appStore.getFoodList();
    console.log(foodList);
    console.log(appStore.myTokenList);
    var restaurant = window.location.href.split('=')[1];
    restaurant = restaurant.replace('%20', ' ');

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
            <div className={styles.container}>
            <Title level={3} className={styles.title}>
                {restaurant}
            </Title>
                {spliceList(foodList).map((row, idx) => {
                    // display 3 cols per row for > xs screen
                    return (
                        <Row gutter={[2, 2]} key={idx}>
                            {row.map((food) => (
                                <MenuCard key={food._id} food={food} />
                            ))}
                        </Row>
                    );
                })}
            </div>
            <GiftModal/>
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(MenuPage));
