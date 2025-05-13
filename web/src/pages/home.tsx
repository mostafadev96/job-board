import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from 'antd';
import type { TableProps } from 'antd';
import { gql, useApolloClient } from '@apollo/client';
import TextArea from 'antd/es/input/TextArea';
import { Role } from '@job-board/rbac';
import { useAuth } from '../contexts/auth-context';

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
      description
      country
      contractType
      active
      hiring_company {
        title
      }
      created_at
      id
    }
  }
`;

const HomePage: React.FC = () => {
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

  const applyForJob = async () => {
    try {
      const formData = {
        ...form.getFieldsValue(),
        jobId: selectedItem.id
      };
      console.log(formData);
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation createApplication(
            $createApplicationInput: CreateApplicationInput!
          ) {
            createApplication(
              createApplicationInput: $createApplicationInput
            ) {
              id
            }
          }
        `,
        variables: {
          createApplicationInput: formData,
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
            <Button
                onClick={() => {
                  setModal2Open(true);
                  setSelectedItem(record);
                }}
                disabled={!user || user.role !== Role.SEEKER}
              >
                Apply
              </Button>
          </Space>
        ),
      },
    ]);
  }, []);
  return (
    <>
      {contextHolder}
      <Table<DataType>
        loading={loading}
        columns={tableColumns}
        dataSource={tableData}
      />
      <Modal
        title="Apply for job"
        centered
        open={modal2Open && !!selectedItem}
        okText="Apply"
        cancelText="Cancel"
        onOk={applyForJob}
        onCancel={() => setModal2Open(false)}
      >
        <Form
          labelAlign="left"
          labelWrap
          form={form}
          name="register"
          scrollToFirstError
          style={{ textAlign: 'left' }}
        >
          <Form.Item
            name="seekerShortDescription"
            label="Short introduction"
            rules={[
              {
                required: true,
                message: 'Please enter response!',
              },
            ]}
          >
            <TextArea
              showCount
              maxLength={200}
              placeholder="short description"
              style={{ height: 120, resize: 'none' }}
            />
          </Form.Item>

          <Form.Item
            name="education"
            label="Your education"
            rules={[
              {
                required: true,
                message: 'Please enter your education!',
              },
            ]}
          >
            <TextArea
              showCount
              maxLength={200}
              placeholder="Your education"
              style={{ height: 120, resize: 'none' }}
            />
          </Form.Item>

          <Form.Item
            name="experiences"
            label="Your experiences"
            rules={[
              {
                required: true,
                message: 'Please enter your experiences!',
              },
            ]}
          >
            <TextArea
              showCount
              maxLength={200}
              placeholder="disable experiences"
              style={{ height: 120, resize: 'none' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default HomePage;
