import React from 'react';
import {
  Button,
  Typography,
} from 'antd';

const { Text } = Typography;

const AppLogoComponent: React.FC = () => {
  return <Button type="link" href="/" style={{
    padding: 0,
  }}>
    <Text style={{
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: 'bold',
  }}>Job Board</Text>
  </Button>
};

export default AppLogoComponent;
