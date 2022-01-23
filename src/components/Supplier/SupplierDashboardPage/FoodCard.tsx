/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Popconfirm, Card, Col, Spin, notification, Tooltip, Row } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import { FoodType } from '../../../stores/AppStore';
import styles from './FoodCard.module.css';
import { observer } from 'mobx-react';

const FoodCard: React.FC<{ food: FoodType }> = ({ food }) => {
    const { Meta } = Card;

    const { appStore, uiState } = useStores();

    return (
        <Col xs={24} xl={8}>
            <Card
                className={styles.card}
                hoverable
                key={food._id}
                cover={<img src={food.foodImageUrl} width="400" height="292" />}
            >
                <Meta
                    title={
                        <Row justify="space-between">
                            <Col>{food.foodName}</Col>
                            <Col>{' $' + food.foodPrice}</Col>
                        </Row>
                    }
                    description={food.foodDescription}
                />
            </Card>
        </Col>
    );
};

export default observer(FoodCard);
