/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Popconfirm, Card, Col, Spin, notification } from 'antd';
import { useStores } from '../../stores/StoreProvider';
import { FoodType } from '../../stores/AppStore';
import styles from './FoodCard.module.css';

const MenuCard: React.FC<{ food: FoodType }> = ({ food }) => {
    const { Meta } = Card;

    const { appStore } = useStores();

    return (
        <Col xs={24} xl={8}>
            <Card
                className={styles.card}
                hoverable
                key={food._id + Math.random()}
                cover={<img src={food.foodImageUrl} width="400" height="292" />}
            >
                <Meta
                    title={food.foodName + ' $' + food.foodPrice}
                    description={food.foodDescription}
                />
            </Card>
        </Col>
    );
};

export default MenuCard;
