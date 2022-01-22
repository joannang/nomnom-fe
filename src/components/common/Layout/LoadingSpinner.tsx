/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { observer } from 'mobx-react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    text: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    text,
}: LoadingSpinnerProps) => {
    return (
        <div className={styles.container}>
            <div>
                <img
                    width='100px'
                    src='/gift.png'
                    alt="loader"
                    className={styles.img}
                    data-testid="loading-spinner"
                />
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    );
};

export default observer(LoadingSpinner);
