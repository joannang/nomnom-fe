/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import ContentLayout from '../../common/Layout/ContentLayout';
import styles from './SupplierBoosterPage.module.css';
import { Card, Col, Row, Typography } from 'antd';
import { observer } from 'mobx-react';
import checkAuthenticated from '../../../security/checkAuthenticated';

const SupplierBoosterPage: React.FC = () => {
    const { Title, Text } = Typography;
    const { Meta } = Card;

    let name = '';

    const supplier = JSON.parse(sessionStorage.getItem('supplier'));
    if (supplier) { 
        name = supplier.supplierName;
    }

    const tiers = [
        {
            _id: 1,
            img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
            level: 'Bronze Tier',
            description:
            <span>As a bronze tier member, your restaurant will be boosted to the top of the discover page for <Text italic>a week</Text>.</span>,
        },
        {
            _id: 2,
            img: 'https://images.unsplash.com/photo-1497888329096-51c27beff665?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80',
            level: 'Silver Tier',
            description:
            <span>As a silver tier member, your restaurant will be boosted to the top of the discover page for <Text italic>2 weeks</Text>.</span>,
        },
        {
            _id: 3,
            img: 'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
            level: 'Gold Tier',
            description:
                <span>As a gold tier member, your restaurant will be boosted to the top of the discover page for <Text italic>a month</Text>.</span>,
        },
    ];

    return (
        <ContentLayout
            data-testid="menu-page"
            title={'Nomnom'}
            isSupplier={true}
        >
            <div className={styles.container}>
                <Row gutter={[16, 16]}>
                    {tiers.map((tier) => (
                        <Col key={tier._id} xs={24} xl={8}>
                            <Card
                                hoverable
                                className={styles.boostercard}
                                actions={[<div key="edit">Buy Now</div>]}
                                cover={<img src={tier.img} />}
                            >
                                <Title level={4}>{tier.level}</Title>
                                <Meta description={tier.description} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </ContentLayout>
    );
};

export default checkAuthenticated(observer(SupplierBoosterPage));
