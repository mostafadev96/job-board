import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import AppLogoComponent from '../components/app-logo';
import { Resource } from '@job-board/rbac';
import { canAccessResources } from '../utils/auth-util';
import { useAuth } from '../contexts/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const SidebarComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sideBarItems = canAccessResources(user.role);
  const items: MenuItem[] = sideBarItems.map((item, index) => {
    const [firstChar, ...endOfText] = item.label;
    return getItem(firstChar.toUpperCase() + endOfText.join(''), index);
  });
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          borderRadius: borderRadiusLG,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AppLogoComponent />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[String(sideBarItems.findIndex(item => item.link === location.pathname))]}
        mode="inline"
        onClick={(item) => {
            const idx = Number(item.key);
            navigate(sideBarItems[idx].link)
        }}
        items={items}
      />
    </Sider>
  );
};

export default SidebarComponent;
