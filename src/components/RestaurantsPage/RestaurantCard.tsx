/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Popconfirm, Card, Col, Spin, notification } from 'antd';
import { useStores } from '../../stores/StoreProvider';
import { RestaurantType } from '../../stores/AppStore';
import styles from './RestaurantCard.module.css';

const RestaurantCard: React.FC<{ restaurant: RestaurantType }> = ({
    restaurant,
}) => {
    const { appStore } = useStores();
    const { Meta } = Card;

    return (
        <Col xs={24} xl={8}>
            <Card
                className={styles.card}
                hoverable
                key={restaurant._id}
                cover={
                    <img
                        src={restaurant.restaurantImageUrl}
                        width="400"
                        height="292"
                    />
                }
                onClick={() =>
                    (window.location.href = `/menu?id=${restaurant.restaurantName}`)
                }
            >
                <Meta
                    title={restaurant.restaurantName}
                    description={restaurant.restaurantDescription}
                />
            </Card>
        </Col>
    );
};

export default RestaurantCard;
