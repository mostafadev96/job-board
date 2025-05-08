import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Flex, Form, Input } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';

const LoginPage = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  return (
    <Card
      style={{
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
        minHeight: '400px',
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
            <Button type="link" href="/register" >
              Register
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default LoginPage;
