/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Popconfirm, Card, Col, Spin, notification, Tooltip, Row } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import { FoodType } from '../../../stores/AppStore';
import styles from './MenuCard.module.css';
import { GiftOutlined, ShopOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

const MenuCard: React.FC<{ food: FoodType }> = ({ food }) => {
    const { Meta } = Card;

    const { appStore, uiState } = useStores();

    const handleBuying = (food) => {
        appStore.buyFood(food._id);
    };

    const handleGifting = (food) => {
        sessionStorage.setItem('food', food._id);
        uiState.setGiftModalOpen(true);
    };

    return (
        <Col xs={24} xl={8}>
            <Card
                className={styles.card}
                hoverable
                key={food._id}
                cover={<img src={food.foodImageUrl} width="400" height="292" />}
                actions={[
                    <Tooltip key="shop" title="Buy food for yourself :)">
                        <div onClick={() => handleBuying(food)}><ShopOutlined  /> Purchase </div>
                    </Tooltip>,
                    <Tooltip key="gift" title="Gift food to your friends!">
                        <div onClick={() => handleGifting(food)}><GiftOutlined  /> Gift </div>

                    </Tooltip>,
                ]}
            >
                <Meta
                    title={
                        <div>
                            <Row justify="space-between">
                                <Col>{food.foodName}</Col>
                                <Col>{' $' + food.foodPrice}</Col>
                            </Row>
                        </div>
                    }
                    description={ <div className={styles.meta}> {food.foodDescription} </div> }
                />
            </Card>
        </Col>
    );
};

export default observer(MenuCard);
