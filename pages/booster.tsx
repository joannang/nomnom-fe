import * as React from 'react';
import SupplierBoosterPage from '../src/components/Supplier/SupplierBoosterPage';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const Booster: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <SupplierBoosterPage {...withCheckLoginProps} />;
};

export default Booster;
