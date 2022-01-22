/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Drawer, Menu, Space } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import styles from './ContentLayout.module.css';
import { useMediaQuery } from 'beautiful-react-hooks';
import { MenuOutlined } from '@ant-design/icons';

type IProps = {
    title: string;
};

const HeaderLinks: React.FC<IProps> = (props) => {
    const isBrowser = (): boolean => typeof window !== 'undefined';
    const isMobile = isBrowser() ? useMediaQuery('(max-width: 65rem)') : false;

    const [isVisible, setIsVisible] = useState(false);

    const DesktopHeader = () => (
        <>
            <Space size={isMobile ? 30 : 60}>
                <span
                    onClick={() => (window.location.href = '/dashboard')}
                    className={styles.title}
                >
                    {props.title}
                </span>
                <a>
                    <small
                        className={styles.links}
                        onClick={() => (window.location.href = '/food')}
                    >
                        My Mommoms
                    </small>
                </a>
            </Space>
        </>
    );

    const MobileHeader = () => (
        <>
            <Button
                style={{ background: 'transparent' }}
                type="primary"
                icon={<MenuOutlined />}
                onClick={() => setIsVisible(true)}
            />
        </>
    );

    const LinkDrawer = () => (
        <Drawer
            bodyStyle={{ color: '#ccca82' }}
            title={<span className={styles.title}>{props.title}</span>}
            visible={isVisible}
            onClose={() => setIsVisible(false)}
            placement="left"
        >
            <Menu defaultSelectedKeys={[window.location.pathname]}>
                <Menu.Item key="/dashboard">
                    <a href={'/dashboard'}>Dashboard</a>
                </Menu.Item>
                <Menu.Item key="/food">
                    <a href={'/food'}>My Mommoms</a>
                </Menu.Item>
            </Menu>
        </Drawer>
    );

    return (
        <>
            {isMobile ? <MobileHeader /> : <DesktopHeader />}
            <LinkDrawer />
        </>
    );
};

export default HeaderLinks;
