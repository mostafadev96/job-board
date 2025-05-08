import React from 'react';
import {
  Layout,
} from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../partials/header';
import FooterComponent from '../partials/footer';
const { Content } = Layout;


const AppLayout: React.FC = () => {
  return (
    <Layout>
      <HeaderComponent />
      <Content style={{ padding: '0 4px', height: 'calc(100vh - 130px)' }}>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default AppLayout;
