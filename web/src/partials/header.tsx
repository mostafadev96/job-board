import React from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Typography,
} from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import AppLogoComponent from '../components/app-logo';
const { Header } = Layout;

const { Text } = Typography;

interface HeaderProps {
  noTitle?: boolean;
}

const HeaderComponent: React.FC<HeaderProps> = ({ noTitle = false }: HeaderProps) => {
  return (
    <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!noTitle && <AppLogoComponent />}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={[
            {
              label: (
                <Button color="default" variant="outlined">
                  <Text>Login</Text>
                  <UserOutlined />
                </Button>
              ),
              key: 'login',
            },
          ]}
          style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
        />
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.antgroup.com"
                  >
                    Settings
                  </a>
                ),
                icon: <SettingOutlined />,
              },
              {
                key: '2',
                label: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.antgroup.com"
                  >
                    Logout
                  </a>
                ),
                icon: <UserOutlined />,
              },
            ],
          }}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
        >
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Header>
  );
};

export default HeaderComponent;
