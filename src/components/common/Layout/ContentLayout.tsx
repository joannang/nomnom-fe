/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { Layout, Spin } from 'antd';
import styles from './ContentLayout.module.css';
import FriendsPanel from '../FriendsPanel';
import SendGiftsModal from '../AddFriendsModal';
import HeaderLinks from './HeaderLinks';
import FunctionalButtons from './FunctionalButtons/FunctionalButtons';
import NotificationMessage from '../NotificationMessage';
import { useStores } from '../../../stores/StoreProvider';
import { observer } from 'mobx-react';
import LoadingSpinner from './LoadingSpinner';

const { Header, Content } = Layout;

type ContentLayoutProps = React.PropsWithChildren<{
    'data-testid'?: string;
    title?: string;
    back?: boolean;
    className?: string;
    isSupplier?: boolean;
}>;

const ContentLayout: React.FC<ContentLayoutProps> = (props) => {
    const { children, title, back, className, isSupplier } = props;

    const { uiState } = useStores();

    return (
        <Layout className="content" style={{ minHeight: '150vh' }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <HeaderLinks title={title} isSupplier={isSupplier}/>
                <FunctionalButtons isSupplier={isSupplier} />
                { !isSupplier &&
                    <FriendsPanel />
                }
                <SendGiftsModal />
            </Header>
            <Content className={styles.content}>
                <div data-testid={props['data-testid']}> {children} </div>
            </Content>
            <NotificationMessage/>
            { uiState.isLoading &&
                <LoadingSpinner text={'Please wait for the blockchain to work its magic~'}/>
            }
        </Layout>
    );
};

export default observer(ContentLayout);
