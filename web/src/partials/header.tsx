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
import { useAuth } from '../contexts/auth-context';
const { Header } = Layout;

const { Text } = Typography;

interface HeaderProps {
  noTitle?: boolean;
}

const HeaderComponent: React.FC<HeaderProps> = ({ noTitle = false }: HeaderProps) => {
  const { user, logout } = useAuth();
  const items = [];
  if(!user) {
    items.push({
      label: (
        <Button color="default" type='link' href='/login' variant="outlined">
          <Text>Login</Text>
          <UserOutlined style={{
            color: 'rgba(0,0,0,0.88)'
          }}/>
        </Button>
      ),
      key: 'login',
    },)
  }
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
          items={items}
          style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
        />
        { user && <Dropdown
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
                  <Button type='link' onClick={() => {
                    logout();
                    
                  }}>
                    Logout
                  </Button>
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
        }
      </Header>
  );
};

export default HeaderComponent;
