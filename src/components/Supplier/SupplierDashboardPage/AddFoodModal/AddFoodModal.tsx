import { DollarOutlined, EditOutlined, LinkOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Modal, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { FoodType } from '../../../../stores/AppStore';
import { useStores } from '../../../../stores/StoreProvider';
import styles from './AddFoodModal.module.css';

const AddFoodModal: React.FC = () => {

    const { uiState, appStore } = useStores();
    const { Title } = Typography;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    // const name = supplier.supplierName;
    const restaurantName = 'Starbucks'; // TODO: hardcoded, delete later

    const handleAddFood = async () => {
        const food: FoodType = {
            foodName: name,
            foodPrice: parseFloat(price),
            foodDescription: description,
            foodImageUrl: url,
            restaurantName: restaurantName
        }

        if (name && price && description && url) {
            setLoading(true);
            await appStore.addFood(food); 
            setLoading(false);
            uiState.setAddFoodModalOpen(false);
        } else {
            uiState.setError('Please fill in all fields.');
        }
    }

    return (
        <Modal
            visible={uiState.addFoodModalOpen}
            onCancel={() => uiState.setAddFoodModalOpen(false)}
            onOk={() => handleAddFood()}
            okText={
                <span>
                    <PlusOutlined /> Add
                </span>
            }
        >
            <Title level={3} className={styles.title}>
                Add an item to your menu ~
            </Title>
            {loading ? (
                <LoadingOutlined size={24} spin />
            ) : (
                <>
                    <Input
                        placeholder='Item Name'
                        className={styles.input}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type='number'
                        placeholder='Price'
                        className={styles.input}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <Input.TextArea
                        placeholder='Description'
                        rows={3}
                        className={styles.input}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input 
                        prefix={
                            <LinkOutlined/>
                        }   
                        placeholder='Image URL'
                        className={styles.input}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </>
            )}
        </Modal>
    )
};

export default observer(AddFoodModal);