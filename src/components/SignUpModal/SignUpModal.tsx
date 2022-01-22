import {
    EnvironmentOutlined,
    LoadingOutlined,
    MailOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Col, Input, Row, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useState } from 'react';
import { UserType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import styles from './SignUpModal.module.css';

const SignUpModal: React.FC = () => {
    const { uiState, walletStore, appStore } = useStores();
    const { Title } = Typography;

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [homeAddr, setHomeAddr] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); //when true, displays a circular loading status instead of the 'Login' text

    const handleClose = () => {
        uiState.setSignUpModalOpen(false);
    };

    const handleSignUp = async () => {
        // call endpoint to sign up
        console.log(walletStore.walletAddress);

        if (password !== confirmPassword) {
            uiState.setError('Your passwords do not match :(');
            return;
        }

        const user: UserType = {
            userName: username,
            userEmail: email,
            userDeliveryAddress: homeAddr,
            userPassword: password,
            userWalletAddress: walletStore.walletAddress,
        };

        if (
            username &&
            email &&
            homeAddr &&
            password &&
            walletStore.walletAddress
        ) {
            // all fields are filled in
            setLoading(true);
            await appStore.signUp(user);
            setLoading(false);
        } else {
            uiState.setError('Please fill in all fields.');
        }
        uiState.setSignUpModalOpen(false);
    };

    return (
        <Modal
            visible={uiState.signUpModalOpen}
            closable={false}
            onCancel={handleClose}
            onOk={handleSignUp}
            okText={'Sign Up!'}
        >
            <Title level={3} className={styles.title}>
                Sign up to Mommom!
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
                        placeholder="Username"
                        className={styles.input}
                        onChange={(e) => setUsername(e.target.value)}
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
                        placeholder="Home Address"
                        className={styles.input}
                        onChange={(e) => setHomeAddr(e.target.value)}
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
    );
};

export default observer(SignUpModal);
