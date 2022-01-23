import { LinkOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { DatePicker, Input, Modal, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { FoodType, VoucherType } from '../../../../stores/AppStore';
import { useStores } from '../../../../stores/StoreProvider';
import styles from './AddVoucherModal.module.css';

const AddVoucherModal: React.FC = () => {
    const { uiState, appStore, walletStore } = useStores();
    const { Title } = Typography;

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date());

    let name = '';

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    if (supplier) { 
        name = supplier.supplierName;
    }

    const handleAddVoucher = async () => {
        const voucher: VoucherType = {
            supplierName: name, // company name
            walletAddress: walletStore.walletAddress,
            value: parseFloat(value),
            expiryDate: expiryDate.toString(),
        };

        if (name && value && expiryDate) {
            setLoading(true);
            await appStore.addVoucher(voucher);
            setLoading(false);
            uiState.setAddVoucherModalOpen(false);
        } else {
            uiState.setError('Please fill in all fields.');
        }
    };

    const onChangeDate = (date, dateString) => {
        setExpiryDate(date.toDate());
    };

    return (
        <Modal
            visible={uiState.addVoucherModalOpen}
            onCancel={() => uiState.setAddVoucherModalOpen(false)}
            onOk={() => handleAddVoucher()}
            okText={
                <span>
                    <PlusOutlined /> Add
                </span>
            }
        >
            <Title level={3} className={styles.title}>
                Add a Voucher
            </Title>
            {loading ? (
                <LoadingOutlined size={24} spin />
            ) : (
                <>
                    <Input
                        type='number'
                        placeholder="Value (ETH)"
                        className={styles.input}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <DatePicker
                        placeholder='Expiry Date'
                        onChange={onChangeDate}
                        className={styles.input}
                        style={{ width: '100%' }}
                    />
                </>
            )}
        </Modal>
    );
};

export default observer(AddVoucherModal);
