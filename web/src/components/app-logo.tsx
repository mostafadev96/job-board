import React from 'react';
import {
  Typography,
} from 'antd';

const { Text } = Typography;

const AppLogoComponent: React.FC = () => {
  return <Text style={{
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: 'bold',
  }}>Job Board</Text>
};

export default AppLogoComponent;
