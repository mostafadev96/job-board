import React from 'react';
import { Typography } from 'antd';
import { useAuth } from '../../contexts/auth-context';

const { Title, } = Typography;

const WelcomePage = () => {
    const { user } = useAuth();
    return (
        <Typography>
            <Title>Welcome back {user.user.name}</Title>
        </Typography>
    )
};

export default WelcomePage;