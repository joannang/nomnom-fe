import * as React from 'react';
import SupplierDashboardPage from '../src/components/Supplier/SupplierDashboardPage';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const Supplier: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <SupplierDashboardPage {...withCheckLoginProps} />;
};

export default Supplier;
