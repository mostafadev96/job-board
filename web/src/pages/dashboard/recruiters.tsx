import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import type { FormInstance, PopconfirmProps, TableProps } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { gql, useApolloClient } from '@apollo/client';
import { canAccess } from '../../utils/auth-util';
import { useAuth } from '../../contexts/auth-context';
import { Action, Resource } from '@job-board/rbac';

interface DataType {
  id: string;
  email: string;
  name: string;
  companyId: string;
  companyAdmin: string;
  hiring_company_title: string;
  active: string;
}

const LIST_QUERY = gql`
  query {
    recruiters {
      email
      name
      companyAdmin
      companyId
      hiring_company {
        title
      }
      active
      id
    }
  }
`;

const ResourceForm = ({ form, data, onSubmit }: { form: FormInstance; data?: any, onSubmit: (...args: any[]) => any }) => {
  form.setFieldValue('email', data?.email || '');
  form.setFieldValue('name', data?.name || '');
  form.setFieldValue('password', '');
  form.setFieldValue('companyAdmin', data?.companyAdmin || '');
  form.setFieldValue('companyId', data?.companyId || '');
  form.setFieldValue('active', data?.active || '');
  return (
    <Form
      labelAlign="left"
      labelWrap
      form={form}
      name="register"
      onFinish={onSubmit}
      scrollToFirstError
      style={{ textAlign: 'left' }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: !data,
            message: 'Please enter email!',
          },
          {
            type: 'email',
            message: 'enter a valid email',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: !data,
            message: 'Please enter name',
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
            required: !data,
            message: 'Please enter password!',
            whitespace: true,
          },
        ]}
      >
        <Input.Password disabled={data}/>
      </Form.Item>
      <Form.Item
        name="companyId"
        label="Company Id"
        rules={[
          {
            required: !data,
            message: 'Please enter companyId',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="companyAdmin"
        label="Company Admin"
        valuePropName="checked"
      >
        <Checkbox>
          <Paragraph style={{ margin: 0 }} strong>
            Mark as active
          </Paragraph>
        </Checkbox>
      </Form.Item>
      <Form.Item
        name="active"
        label="Active"
        valuePropName="checked"
      >
        <Checkbox>
          <Paragraph style={{ margin: 0 }} strong>
            Mark as active
          </Paragraph>
        </Checkbox>
      </Form.Item>
    </Form>
  );
};

const RecruiterPage: React.FC = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [api, contextHolder] = notification.useNotification();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState<
    TableProps<DataType>['columns']
  >([]);
  const [form] = Form.useForm();
  const client = useApolloClient();
  const openNotificationWithIcon = (message: string) => {
    api.error({
      message: 'Error',
      description: message,
    });
  };
  const deleteSeletectItem = async (record: any) => {
    try {
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation RemoveRecruiter($id: String!) {
            removeRecruiter(id: $id)
          }
        `,
        variables: {
          id: record.id,
        },
      });
      console.log(data);
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message);
      }
      await fetchTableData();
    } catch (error: any) {
      console.error('Error fetching data:', error);
      openNotificationWithIcon(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createResource = async () => {
    try {
      const formData = form.getFieldsValue();
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation createRecruiter(
            $createRecruiterInput: CreateRecruiterInput!
          ) {
            createRecruiter(
              createRecruiterInput: $createRecruiterInput
            ) {
              id
            }
          }
        `,
        variables: {
          createRecruiterInput: {
            ...formData,
            companyAdmin: formData.companyAdmin ? true: false,
            active: formData.active ? true: false
          },
        },
      });
      console.log(data);
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message);
      }
      await fetchTableData();
    } catch (error: any) {
      console.error('Error fetching data:', error);
      openNotificationWithIcon(error.message);
    } finally {
      setLoading(false);
      setModal2Open(false);
      setSelectedItem(null);
    }
  };

  const updateResource = async () => {
    try {
      const formData = form.getFieldsValue();
      const {password, ...coreData} = formData;
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation UpdateRecruiter(
            $updateRecruiterInput: UpdateRecruiterInput!
          ) {
            updateRecruiter(updateRecruiterInput: $updateRecruiterInput) {
              id
            }
          }
        `,
        variables: {
          updateRecruiterInput: {
            id: selectedItem.id,
            ...coreData,
            ...(password && {password})
          },
        },
      });
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message);
      }
      await fetchTableData();
    } catch (error: any) {
      console.error('Error fetching data:', error);
      openNotificationWithIcon(error.message);
    } finally {
      setLoading(false);
      setModal2Open(false);
      setSelectedItem(null);
    }
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const { data } = await client.query({
        query: LIST_QUERY,
        fetchPolicy: 'network-only',
      });
      console.log(data);
      setTableData(data.recruiters.map((item: any)=> ({
        ...item,
        recruiter_name: item?.recruiters?.name,
        hiring_company_title: item?.hiring_company?.title
      })));    } catch (error: any) {
      console.error('Error fetching data:', error);
      openNotificationWithIcon(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelDeletion: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('Click on No');
  };
  useEffect(() => {
    fetchTableData();
  }, [client]);

  useEffect(() => {
    setTableColumns([
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Company Id',
        dataIndex: 'companyId',
        key: 'companyId',
      },
      {
        title: 'Company Admin',
        dataIndex: 'companyAdmin',
        key: 'companyAdmin',
        render: (_, { companyAdmin }) => (
          <Tag color={companyAdmin ? 'green' : 'volcano'}>
            {companyAdmin ? 'Active' : 'Not Active'}
          </Tag>
        ),
      },
      {
        title: 'Company name',
        dataIndex: 'hiring_company_title',
        key: 'hiring_company_title',
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        render: (_, { active }) => (
          <Tag color={active ? 'green' : 'volcano'}>
            {active ? 'Active' : 'Not Active'}
          </Tag>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            {canAccess(user.role, Resource.RECRUITER, Action.UPDATE) && (
              <Button
                onClick={() => {
                  setModal2Open(true);
                  setSelectedItem(record);
                }}
              >
                Update
              </Button>
            )}
            {canAccess(user.role, Resource.RECRUITER, Action.DELETE) && (
              <Popconfirm
                title="Delete the item"
                description="Are you sure to delete this item?"
                onConfirm={() => {
                  deleteSeletectItem(record);
                }}
                onCancel={cancelDeletion}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ]);
  }, []);
  return (
    <>
      {contextHolder}
      <Flex
        gap="small"
        justify="space-between"
        style={{
          marginBottom: '16px',
        }}
        wrap
      >
        <Paragraph style={{ fontSize: '22px' }} strong>
          Recruiters
        </Paragraph>
        {canAccess(user.role, Resource.RECRUITER, Action.CREATE) && (
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: '#001529',
            }}
            onClick={() => setModal1Open(true)}
          >
            Add Recruiter
          </Button>
        )}
      </Flex>
      <Table<DataType>
        loading={loading}
        columns={tableColumns}
        dataSource={tableData}
      />
      <Modal
        title="Create new item"
        centered
        open={modal1Open}
        okText="Add"
        cancelText="Cancel"
        onOk={form.submit}
        onCancel={() => setModal1Open(false)}
      >
        <ResourceForm form={form} onSubmit={createResource}/>
      </Modal>
      <Modal
        title="Update item"
        centered
        open={modal2Open && !!selectedItem}
        okText="Update"
        cancelText="Cancel"
        onOk={form.submit}
        onCancel={() => setModal2Open(false)}
      >
        <ResourceForm form={form} data={selectedItem} onSubmit={updateResource} />
      </Modal>
    </>
  );
};

export default RecruiterPage;
