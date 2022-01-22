/* eslint-disable react/display-name */
import * as React from 'react';
import { Observer } from 'mobx-react';
import { CookiesProvider } from 'react-cookie';
import AppStore from '../stores/AppStore';
import { Spin } from 'antd';

/**
 * Since Msal library's function 'handleRedirectPromise' needs to be run on the login page
 * in the case the user cancels and interrupts the password reset or sign up process
 * (to resolve the promise and prevent BrowserAuthError: Interaction in progress),
 * withCheckLogin is used for both login page and protected pages, with the added
 * prop of isLoginPage to differentiate the login page from the other protected ones
 */

export interface withCheckLoginProps {
    appStore: AppStore;
    routeToLogin?: () => void; // route to login
}

const AwaitingComponent = () => {
    return <Spin style={{ top: '50%', left: '50%', position: 'absolute' }} />;
};

const withCheckLogin = (Component: React.FC) =>
    class extends React.Component<withCheckLoginProps> {
        async componentDidMount() {
            if (typeof window == undefined) return;
        }

        render() {
            const { appStore, routeToLogin } = this.props;
            return (
                <CookiesProvider>
                    <Observer
                        render={() => {
                            switch (appStore.isAuthenticated) {
                                case 'checking':
                                    return <AwaitingComponent />;
                                case 'true':
                                    return <Component {...this.props} />;
                                default:
                                    routeToLogin && routeToLogin();
                                    return null;
                            }
                        }}
                    />
                </CookiesProvider>
            );
        }
    };

export default withCheckLogin;
