import * as React from 'react';
import { useEffect } from 'react';
import { notification } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';

const NotificationMessage: React.FC = () => {
    const { uiState } = useStores();

    useEffect(() => {
        uiState.success &&
            notification['success']({
                message: uiState.success,
                onClose: onClose,
            });

        uiState.error &&
            notification['error']({
                message: uiState.error,
                onClose: onClose,
            });
    }, [uiState.success, uiState.error]); // eslint-disable-line react-hooks/exhaustive-deps

    const onClose = () => {
        uiState.success && uiState.setSuccess('');

        uiState.error && uiState.setError('');
    };

    return <></>;
};

export default observer(NotificationMessage);
