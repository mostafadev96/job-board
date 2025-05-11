import { BookOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Input,
  notification,
  Select,
  Spin,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { loginApi } from '../../apis/auth-api';
import { useAuth } from '../../contexts/auth-context';
import { useState } from 'react';
const { Option } = Select;

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (message: string) => {
    api.error({
      message: 'Error',
      description: message,
    });
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userData = await loginApi(values);
      login(userData, values.role , values.remember);
      if(values.role === 'seeker') {
        window.location.href = '/';
      }
      else {
        window.location.href = '/dashboard';
      }
    } catch (e: any) {
      openNotificationWithIcon(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Card
          style={{
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '300px',
            minHeight: '400px',
            marginTop: '150px',
          }}
        >
          <Paragraph style={{ fontSize: '24px', marginBottom: '32px' }}>
            Login
          </Paragraph>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="role"
              rules={[{ required: true, message: 'Please select role!' }]}
            >
              <Select
                placeholder="select your role"
                prefix={<BookOutlined className="site-form-item-icon" />}
              >
                <Option value="admin">Admin</Option>
                <Option value="recruiter">Recruiter</Option>
                <Option value="seeker">Job seeker</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Email!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>

            <Form.Item>
              <Flex justify={'space-between'} align={'center'}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Button type="link" href="/register">
                  Register
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </>
  );
};
export default LoginPage;
