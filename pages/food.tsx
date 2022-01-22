import * as React from 'react';
import MyFoodPage from '../src/components/MyFoodPage';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const FoodPage: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <MyFoodPage {...withCheckLoginProps} />;
};

export default FoodPage;
