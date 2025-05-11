import React from 'react';
import { Layout } from 'antd';
import HeaderComponent from '../partials/header';
import { Outlet } from 'react-router-dom';
import FooterComponent from '../partials/footer';
import SidebarComponent from '../partials/sidebar';

const { Content } = Layout;
const App: React.FC = () => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent />
      <Layout>
        <HeaderComponent noTitle={true}/>
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: '24px 0',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default App;