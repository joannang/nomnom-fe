import * as React from 'react';
import ContentLayout from '../../common/Layout/ContentLayout';
import styles from './SupplierBoosterPage.module.css'
import { Typography } from 'antd';

const SupplierBoosterPage: React.FC = () => {

    const { Title } = Typography;

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    // const name = supplier.supplierName;
    const name = 'Starbucks'; // TODO: hardcoded, delete later

    // envision three columns straight down each like for the tiers

    return(
        <ContentLayout
            data-testid="menu-page"
            title={'Nomnom'}
            isSupplier={true}
        >
            <div className={styles.container}>
                <Title level={3} className={styles.title}>
                    Welcome, {name}
                </Title>
                
            </div>

        </ContentLayout>
    )
}

export default SupplierBoosterPage;