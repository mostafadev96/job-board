import React from 'react';
import {
  Layout,
  Typography,
} from 'antd';
const { Footer } = Layout;
const { Text } = Typography;

const FooterComponent: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
        Job Board ©{new Date().getFullYear()} Created by <Text style={{
          lineHeight: 0
        }} type='danger'>Xolize</Text>
    </Footer>
  );
};

export default FooterComponent;
