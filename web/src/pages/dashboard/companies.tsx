import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import type { FormInstance, PopconfirmProps, TableProps } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { gql, useApolloClient } from '@apollo/client';
import { canAccess } from '../../utils/auth-util';
import { useAuth } from '../../contexts/auth-context';
import { Action, Resource } from '@job-board/rbac';

interface DataType {
  id: string;
  title: string;
  description: string;
  country: string;
  createdAt: string;
}

const LIST_QUERY = gql`
  query {
    hiringCompanies {
      title
      description
      country
      updatedAt
      id
    }
  }
`;

const ResourceForm = ({ form, data }: { form: FormInstance; data?: any }) => {
  form.setFieldValue('title', data?.title || '')
  form.setFieldValue('description', data?.description || '')
  form.setFieldValue('country', data?.country || '')
  return (
    <Form
      labelAlign="left"
      labelWrap
      form={form}
      name="register"
      scrollToFirstError
      style={{ textAlign: 'left' }}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
            message: 'Please enter title!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          {
            required: true,
            message: 'Please enter description',
            whitespace: true,
          },
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="country"
        label="Country"
        rules={[
          {
            required: true,
            message: 'Please enter country!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

const CompanyPage: React.FC = () => {
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
          mutation RemoveHiringCompany($id: String!) {
            removeHiringCompany(id: $id)
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
      console.log(formData);
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation CreateHiringCompany($createHiringCompanyInput: CreateHiringCompanyInput!) {
            createHiringCompany(createHiringCompanyInput: $createHiringCompanyInput) {
              id
            }
          }
        `,
        variables: {
          createHiringCompanyInput: formData
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
      setModal1Open(false);
      setSelectedItem(null);
    }
  }

  const updateResource = async () => {
    try {
      const formData = form.getFieldsValue();
      console.log(formData);
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation UpdateHiringCompany(
            $updateHiringCompanyInput: UpdateHiringCompanyInput!
          ) {
            updateHiringCompany(updateHiringCompanyInput: $updateHiringCompanyInput) {
              id
            }
          }
        `,
        variables: {
          id: selectedItem.id,
          updateHiringCompanyInput: {
            id: selectedItem.id,
            ...formData
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
  }

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const { data } = await client.query({
        query: LIST_QUERY,
        fetchPolicy: 'network-only'
      });
      console.log(data);
      setTableData(data.hiringCompanies);
    } catch (error: any) {
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
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: 'Creation Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            {canAccess(user.role, Resource.HIRING_COMPANY, Action.UPDATE) && (
              <Button
                onClick={() => {
                  setModal2Open(true);
                  setSelectedItem(record);
                }}
              >
                Update
              </Button>
            )}
            {canAccess(user.role, Resource.HIRING_COMPANY, Action.DELETE) && (
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
          Companies
        </Paragraph>
        {canAccess(user.role, Resource.HIRING_COMPANY, Action.CREATE) && (
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: '#001529',
            }}
            onClick={() => setModal1Open(true)}
          >
            Add Company
          </Button>
        )}
      </Flex>
      <Table<DataType>
        loading={loading}
        columns={tableColumns}
        dataSource={tableData}
      />
      <Modal
        title="Create new company"
        centered
        open={modal1Open}
        okText="Add"
        cancelText="Cancel"
        onOk={createResource}
        onCancel={() => setModal1Open(false)}
      >
        <ResourceForm form={form} />
      </Modal>
      <Modal
        title="Update company"
        centered
        open={modal2Open && !!selectedItem}
        okText="Update"
        cancelText="Cancel"
        onOk={updateResource}
        onCancel={() => setModal2Open(false)}
      >
        <ResourceForm form={form} data={selectedItem} />
      </Modal>
    </>
  );
};

export default CompanyPage;
