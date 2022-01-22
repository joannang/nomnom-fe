import { EnvironmentOutlined, LoadingOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Modal, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { SupplierType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import styles from './SupplierSignUpModal.module.css';

const SupplierSignUpModal: React.FC = () => {

    const { uiState, walletStore, appStore } = useStores();
    const { Title } = Typography;

    const [supplierName, setSupplierName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [addr, setAddr] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); //when true, displays a circular loading status instead of the 'Login' text

    const handleClose = () => {
        uiState.setSupplierSignUpModalOpen(false);

    };

    const handleSignUp = async() => {
        if (password !== confirmPassword) {
            uiState.setError('Your passwords do not match :(');
            return;
        }

        const supplier: SupplierType = {
            supplierName: supplierName,
            supplierEmail: email,
            supplierAddress: addr,
            supplierPassword: password,
            supplierWalletAddress: walletStore.walletAddress,
        };

        if (
            supplierName &&
            email &&
            addr &&
            password &&
            walletStore.walletAddress
        ) {
            // all fields are filled in
            setLoading(true);
            await appStore.supplierSignUp(supplier);
            // TODO: call appstore sign up for suppier
            setLoading(false);
        } else {
            uiState.setError('Please fill in all fields.');
        }
        uiState.setSupplierSignUpModalOpen(false);
    }

    return (
        <Modal
            visible={uiState.supplierSignUpModalOpen}
            closable={false}
            onCancel={handleClose}
            onOk={handleSignUp}
            okText={'Sign Up!'}
        >
            <Title level={3} className={styles.title}>
                Sign up to Nomnom!
            </Title>
            {loading ? (
                <LoadingOutlined size={24} spin />
            ) : (
                <>
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        data-testid="username-input"
                        placeholder="Supplier Name"
                        className={styles.input}
                        onChange={(e) => setSupplierName(e.target.value)}
                    />
                    <Input
                        prefix={
                            <MailOutlined className="site-form-item-icon" />
                        }
                        data-testid="mail-input"
                        placeholder="Email Address"
                        className={styles.input}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        prefix={
                            <EnvironmentOutlined className="site-form-item-icon" />
                        }
                        data-testid="homeaddr-input"
                        placeholder="Address"
                        className={styles.input}
                        onChange={(e) => setAddr(e.target.value)}
                    />
                    <Input.Password
                        data-testid="password-input"
                        placeholder="New Password"
                        className={styles.input}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input.Password
                        data-testid="cfmpassword-input"
                        placeholder="Confirm New Password"
                        className={styles.input}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </>
            )}
        </Modal>
    )
}

export default observer(SupplierSignUpModal);