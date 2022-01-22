import * as React from 'react';
import { useEffect } from 'react';
import { PlusSquareOutlined, SyncOutlined } from '@ant-design/icons';
import { PageHeader, Button, Row, Col } from 'antd';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import ContentLayout from '../common/Layout/ContentLayout';
import RestaurantCard from './RestaurantCard';
import checkAuthenticated from '../../security/checkAuthenticated';
import styles from './RestaurantCard.module.css';

const moviesPerRow = 3;

const RestaurantsPage: React.FC = () => {
    const { appStore } = useStores();

    useEffect(() => {
        appStore.setRestaurantList();
    }, []);

    const restaurants = appStore.getAllRestaurants();
    console.log(restaurants);

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
        <ContentLayout data-testid="restaurant-page" title={'Mommom'}>
            <div className={styles.container}>
                {spliceList(restaurants).map((row, idx) => {
                    // display 3 cols per row for > xs screen
                    return (
                        <Row gutter={[2, 2]} key={idx}>
                            {row.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant._id}
                                    restaurant={restaurant}
                                />
                            ))}
                        </Row>
                    );
                })}
            </div>
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(RestaurantsPage));
