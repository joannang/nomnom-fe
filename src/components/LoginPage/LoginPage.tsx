/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { useState } from 'react';
import styles from './LoginPage.module.css';
import { Tabs, Card, Typography, Input, Button, Row, Col, Image } from 'antd';
import { useMediaQuery } from 'beautiful-react-hooks';
import SignUpModal from '../SignUpModal';
import { useStores } from '../../stores/StoreProvider';
import { observer } from 'mobx-react';
import NotificationMessage from '../common/NotificationMessage';
import SupplierSignUpModal from '../SupplierSignUpModal';

const LoginPage: React.FC = () => {
    const { Title } = Typography;

    const { uiState, appStore } = useStores();
    const { TabPane } = Tabs;

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [supplierName, setSupplierName] = useState<string>('');
    const [supplierPassword, setSupplierPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false); //when true, displays a circular loading status instead of the 'Login' text

    const isBrowser = (): boolean => typeof window !== 'undefined';
    const isMobile = isBrowser() ? useMediaQuery('(max-width: 65rem)') : false;

    const handleLogin = async (event, type: string) => {
        event.preventDefault();
        setLoading(true);

        // both fields filled in
        // TODO: uncomment username and pw check
        if (username && password) {
            // call api to submit
            try {
                if (type == 'user') {
                    await appStore.signIn(username, password);
                    window.location.href = '/dashboard';
                } else {
                    await appStore.supplierSignIn(supplierName, supplierPassword);
                    window.location.href = '/supplier';
                }
            } catch (err) {
                console.log(err.message);
            }
        } else {
            uiState.setError('Please key in both username & password!');
        }
    };

    const handleChangeTabs = () => {
        uiState.setSignUpModalOpen(false);
    };

    return (
        <>
            <div className={styles.root} data-testid="component-login">
                <Row justify="center">
                    {!isMobile && (
                        <Col span={24} lg={10}>
                            <Image
                                preview={false}
                                src="https://images.unsplash.com/photo-1609501676725-7186f017a4b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
                                alt="Image"
                                className={styles.img}
                            />
                        </Col>
                    )}

                    <Col xs={24} lg={14} className={styles.col}>
                        <div className={styles.container}>
                            <Title className={styles.title} level={1}>
                                Nomnom
                            </Title>
                            <Tabs
                                defaultActiveKey="1"
                                centered
                                onChange={handleChangeTabs}
                            >
                                <TabPane tab="Sign In as User" key="1">
                                    <Card className={styles.card}>
                                        <Input
                                            data-testid="username-input"
                                            size="large"
                                            placeholder="Username"
                                            className={styles.input}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                        />
                                        <Input.Password
                                            data-testid="password-input"
                                            size="large"
                                            placeholder="Password"
                                            className={styles.input}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <Button
                                            data-testid="login-submit-button"
                                            block
                                            size="large"
                                            type="primary"
                                            className={styles.button}
                                            onClick={(e) =>
                                                handleLogin(e, 'user')
                                            }
                                        >
                                            Login
                                        </Button>
                                        <div>
                                            <a
                                                onClick={() =>
                                                    uiState.setSignUpModalOpen(
                                                        true
                                                    )
                                                }
                                            >
                                                Are you a new user? Click here
                                                to sign up.
                                            </a>
                                        </div>
                                    </Card>
                                </TabPane>
                                <TabPane tab="Sign In as Supplier" key="2">
                                    <Card className={styles.card}>
                                        <Input
                                            data-testid="username-input"
                                            size="large"
                                            placeholder="Supplier Name"
                                            className={styles.input}
                                            onChange={(e) =>
                                                setSupplierName(e.target.value)
                                            }
                                        />
                                        <Input.Password
                                            data-testid="password-input"
                                            size="large"
                                            placeholder="Password"
                                            className={styles.input}
                                            onChange={(e) =>
                                                setSupplierPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Button
                                            data-testid="login-submit-button"
                                            block
                                            size="large"
                                            type="primary"
                                            className={styles.button}
                                            onClick={(e) =>
                                                handleLogin(e, 'supplier')
                                            }
                                        >
                                            Login
                                        </Button>
                                        <div>
                                            <a
                                                onClick={() =>
                                                    uiState.setSupplierSignUpModalOpen(
                                                        true
                                                    )
                                                }
                                            >
                                                Are you a new supplier? Click
                                                here to sign up.
                                            </a>
                                        </div>
                                    </Card>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
                <NotificationMessage />
                <SignUpModal />
                <SupplierSignUpModal />
            </div>
        </>
    );
};

export default observer(LoginPage);
