import * as React from 'react';
import MenuPage from '../src/components/MenuPage';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const Menu: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <MenuPage {...withCheckLoginProps} />;
};

export default Menu;
