import { Button, Card, Checkbox, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { loginApi, registerApi } from '../../apis/auth-api';
import { useAuth } from '../../contexts/auth-context';
import { useState } from 'react';
import { Role } from '@job-board/rbac';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },

};
const { Option } = Select;
const RegisterPage = () => {
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
      const userData = await registerApi(values);
      console.log(userData);
      login(userData, Role.SEEKER , false);
      window.location.href = '/';
    } catch (e: any) {
      openNotificationWithIcon(e.message);
    } finally {
      setLoading(false);
    }
  };
  const [form] = Form.useForm();
  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Card
          style={{
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '500px',
            minHeight: '400px',
            marginTop: '150px',
          }}
        >
          <Paragraph style={{ fontSize: '24px', marginBottom: '32px' }}>
            Register
          </Paragraph>
          <Form
            {...formItemLayout}
            labelAlign="left"
            labelWrap
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
            style={{ textAlign: 'left' }}
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              tooltip="Your name will be displayed on your profile"
              rules={[
                {
                  required: true,
                  message: 'Please input your Name!',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              tooltip="Your phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your Phone!',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The new password that you entered do not match!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
            >
              <Checkbox>
                <Paragraph style={{ margin: 0 }} strong>
                  I have read the <Button type="default" variant='link' href="/agreement" target='_blank'>
                agreement
              </Button>
                </Paragraph>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" variant='link' href="/login" block>
                Back to Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </>

  );
};
export default RegisterPage;
