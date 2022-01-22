import * as React from 'react';
import RestaurantsPage from '../src/components/RestaurantsPage';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const Dashboard: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <RestaurantsPage {...withCheckLoginProps} />;
};

export default Dashboard;
