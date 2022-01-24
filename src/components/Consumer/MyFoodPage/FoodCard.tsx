/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Card, Col, Tooltip } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import { FoodType } from '../../../stores/AppStore';
import styles from './FoodCard.module.css';
import { GiftOutlined, ShopOutlined } from '@ant-design/icons';

const MenuCard: React.FC<{ food: FoodType, tokenIdx: number }> = ({ food , tokenIdx}) => {
    const { Meta } = Card;

    const { appStore, uiState } = useStores();

    const handleRedeem = () => {
        sessionStorage.setItem('tokenId', appStore.myTokenList[tokenIdx][1].toString())
        appStore.setRedemptionFood(food);
        uiState.setRedemptionModalOpen(true);
    };

    const handleGifting = () => {
        sessionStorage.setItem('food', JSON.stringify(food));
        uiState.setGiftModalOpen(true);
    };

    return (
        <Col xs={24} xl={8}>
            <Card
                className={styles.card}
                hoverable
                key={food._id + Math.random()}
                cover={<img src={food.foodImageUrl} width="400" height="292" />}
                actions={[
                    <Tooltip key="shop" title="Redeem your food!">
                        <div onClick={() => handleRedeem()} ><ShopOutlined /> Redeem </div>
                    </Tooltip>,
                    <Tooltip key="gift" title="Gift food to your friends!">
                        <div onClick={() => handleGifting()}><GiftOutlined/> Gift </div>

                    </Tooltip>,
                ]}
            >
                <Meta
                    title={food.foodName + ' $' + food.foodPrice}
                    description={ <div className={styles.meta}> {food.foodDescription} </div> }
                />
            </Card>
        </Col>
    );
};

export default MenuCard;
