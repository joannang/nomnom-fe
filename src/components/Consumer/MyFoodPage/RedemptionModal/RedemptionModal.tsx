import {
    FrownOutlined,
    QuestionCircleOutlined,
    SendOutlined,
} from '@ant-design/icons';
import { Button, Modal, Result, Select, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { useStores } from '../../../../stores/StoreProvider';
import styles from './RedemptionModal.module.css';

const RedemptionModal: React.FC = () => {
    const { appStore, uiState } = useStores();

    const { Text, Title } = Typography;
    const { Option } = Select;
    const food = appStore.redemptionFood;

    const handleRedeem = () => {
        const tokenId = Number(sessionStorage.getItem('tokenId'))
        appStore.redeemFood(tokenId);
        console.log('redeemed', tokenId);
        uiState.setRedemptionModalOpen(false)
    };

    return (
        <>
            {food && (
                <Modal
                    visible={uiState.redemptionModalOpen}
                    footer={null}
                    onCancel={() => uiState.setRedemptionModalOpen(false)}
                >
                    <br />
                    <img src={food.foodImageUrl} width="100%" height="292" />
                    <Title level={3} className={styles.title}>
                        {food.foodName}
                    </Title>
                    <Text>
                        {' '}
                        Show this screen to a service staff for redemption of
                        food item
                    </Text>
                    <br />
                    <br />

                    <Text type="danger">
                        {' '}
                        ONLY CLICK REDEEM IN THE PRESENCE OF THE SERVICE
                        STAFF!
                    </Text>
                    <div className={styles.buttonDiv}>
                        <Button
                            size="large"
                            type="primary"
                            onClick={()=> handleRedeem()}
                            className={styles.button}
                        >
                            Redeem
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default observer(RedemptionModal);
