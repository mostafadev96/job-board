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
  Select,
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
import TextArea from 'antd/es/input/TextArea';

interface DataType {
  id: string;
  title: string;
  country: string;
  active: string;
  contractType: string;
  recruiter_name: string;
  hiring_company_title: string;
  created_at: string;
}

const LIST_QUERY = gql`
  query {
    jobs {
      title
      country
      contractType
      active
      recruiter {
        name
      }
      hiring_company {
        title
      }
      created_at
      id
    }
  }
`;

const ResourceForm = ({ form, data, onSubmit }: { form: FormInstance; data?: any, onSubmit: (...args: any[]) => any }) => {
  const { Option } = Select;
  form.setFieldValue('title', data?.email || '');
  form.setFieldValue('desctiption', data?.name || '');
  form.setFieldValue('country', data?.country || '');
  form.setFieldValue('active', data?.active || '');
  form.setFieldValue('contractType', data?.contractType || '');
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
        name="title"
        label="Title"
        rules={[
          {
            required: !data,
            message: 'Please enter title!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="country"
        label="Country"
        rules={[
          {
            required: !data,
            message: 'Please enter country',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contractType"
        label="Contract Type"
        rules={[{ required: true, message: 'Please select contract type!' }]}
      >
        <Select placeholder="select the contract type">
          <Option value="FULL_TIME">Full time</Option>
          <Option value="PART_TIME">part time</Option>
          <Option value="FREELANCE">freelance</Option>
          <Option value="INTERNSHIP">internship</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="description"
        label="Your description"
        rules={[
          {
            required: true,
            message: 'Please enter your description!',
          },
        ]}
      >
        <TextArea
          showCount
          maxLength={200}
          placeholder="disable resize"
          style={{ height: 120, resize: 'none' }}
        />
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

const JobPage: React.FC = () => {
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
          mutation RemoveJob($id: String!) {
            removeJob(id: $id)
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
          mutation CreateJob(
            $createJobInput: CreateJobInput!
          ) {
            createJob(
              createJobInput: $createJobInput
            ) {
              id
            }
          }
        `,
        variables: {
          createJobInput: {
            ...formData,
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
          mutation UpdateJob(
            $updateJobInput: UpdateJobInput!
          ) {
            updateJob(updateJobInput: $updateJobInput) {
              id
            }
          }
        `,
        variables: {
          updateJobInput: {
            id: selectedItem.id,
            ...coreData
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
      setTableData(data.jobs.map((item: any)=> ({
        ...item,
        recruiter_name: item?.recruiter?.name,
        hiring_company_title: item?.hiring_company?.title
      })));
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
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: 'Contract Type',
        dataIndex: 'contractType',
        key: 'contractType',
      },
      {
        title: 'Recruiter Name',
        dataIndex: 'recruiter_name',
        key: 'recruiter_name',
      },
      {
        title: 'Company title',
        dataIndex: 'hiring_company_title',
        key: 'hiring_company_title',
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: 'Creation Date',
        dataIndex: 'created_at',
        key: 'created_at',
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
            {canAccess(user.role, Resource.JOB, Action.UPDATE) && (
              <Button
                onClick={() => {
                  setModal2Open(true);
                  setSelectedItem(record);
                }}
              >
                Update
              </Button>
            )}
            {canAccess(user.role, Resource.JOB, Action.DELETE) && (
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
          Jobs
        </Paragraph>
        {canAccess(user.role, Resource.JOB, Action.CREATE) && (
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: '#001529',
            }}
            onClick={() => setModal1Open(true)}
          >
            Add Job
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

export default JobPage;
