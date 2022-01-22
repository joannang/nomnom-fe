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

    // TODO: reinforce auth checks
    // return <SupplierDashboardPage {...withCheckLoginProps} />;
    return <SupplierDashboardPage/>;
};

export default Supplier;
