import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import type { FormInstance, TableProps } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { gql, useApolloClient } from '@apollo/client';
import { canAccess } from '../../utils/auth-util';
import { useAuth } from '../../contexts/auth-context';
import { Action, Resource } from '@job-board/rbac';

interface DataType {
  id: string;
  seekerName: string;
  seekerPhone: string;
  jobTitle: string;
  jobContractType: string;
  status: string;
  created_at: string;
}

const LIST_QUERY = gql`
  query {
    applications {
      seekerName
      seekerPhone
      jobTitle
      jobContractType
      jobId
      status
      created_at
      id
    }
  }
`;

const ResourceForm = ({ form, data }: { form: FormInstance; data?: any }) => {
  const { Option } = Select;
  form.setFieldValue('recruiterResponse', data?.email || '')
  form.setFieldValue('status', data?.name || '')
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
        name="recruiterResponse"
        label="Response"
        rules={[
          {
            required: true,
            message: 'Please enter response!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select new status!' }]}
        >
          <Select placeholder="select the new status">
            <Option value="APPLIED">Applied</Option>
            <Option value="INTERVIEW">interview</Option>
            <Option value="OFFER">offer</Option>
            <Option value="ACCEPTED">accepted</Option>
            <Option value="REJECTED">rejected</Option>
            <Option value="DECLINED">declined</Option>
            <Option value="HIRED">hired</Option>
          </Select>
        </Form.Item>
    </Form>
  );
};

const ApplicationPage: React.FC = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewedItem, setViewedItem] = useState<any>(null);
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

  const updateResource = async () => {
    try {
      const formData = {
        ...form.getFieldsValue(),
        applicationId: selectedItem.id
      };
      console.log(formData);
      setLoading(true);
      const { data } = await client.mutate({
        mutation: gql`
          mutation CreateApplicationStatus(
            $createApplicationStatusInput: CreateApplicationStatusInput!
          ) {
            createApplicationStatus(
              createApplicationStatusInput: $createApplicationStatusInput
            ) {
              id
            }
          }
        `,
        variables: {
          createApplicationStatusInput: formData,
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
        fetchPolicy: 'network-only'
      });
      console.log(data);
      setTableData(data.applications);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      openNotificationWithIcon(error.message);
    } finally {
      setLoading(false);
    }
  };

  const viewSingleResource = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await client.query({
        query: gql`
          query singleApplication($id: String!) {
            application (
              id: $id
            ) {
              seekerName
              seekerPhone
              seekerEmail
              seekerShortDescription
              experiences
              education
              jobTitle
              jobContractType
              jobId
              status
              created_at
              id
            }
          }
        `,
        variables: {
          id
        },
        fetchPolicy: 'network-only'
      });
      console.log(data);
      setViewedItem(data.application);
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
        title: 'Seeker Name',
        dataIndex: 'seekerName',
        key: 'seekerName',
      },
      {
        title: 'Seeker Phone',
        dataIndex: 'seekerPhone',
        key: 'seekerPhone',
      },
      {
        title: 'Job Title',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
      },
      {
        title: 'Contract Type',
        dataIndex: 'jobContractType',
        key: 'jobContractType',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Creation Date',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            {canAccess(user.role, Resource.APPLICATION_STATUS, Action.CREATE) && (
              <Button
                onClick={() => {
                  setModal2Open(true);
                  setSelectedItem(record);
                }}
              >
                Change status
              </Button>
            )}
            {canAccess(user.role, Resource.APPLICATION, Action.VIEW) && (
              <Button
                onClick={() => {
                  setModal1Open(true);
                  setSelectedItem(record);
                  viewSingleResource(record.id)
                }}
              >
                View details
              </Button>
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
          Applications
        </Paragraph>
      </Flex>
      <Table<DataType>
        loading={loading}
        columns={tableColumns}
        dataSource={tableData}
      />
      <Modal
        title="Update admin"
        centered
        open={modal2Open && !!selectedItem}
        okText="Update"
        cancelText="Cancel"
        onOk={updateResource}
        onCancel={() => setModal2Open(false)}
      >
        <ResourceForm form={form} data={selectedItem} />
      </Modal>
      <Modal
        title="View details"
        centered
        open={modal1Open && !!viewedItem}
        cancelText={false}
        footer={
          <Button type="primary" onClick={() => setModal1Open(false)}>
            Close
          </Button>
        }
      >
        <List
          bordered
          loading={loading}
          dataSource={viewedItem && Object.keys(viewedItem).sort().filter(item => item !== "__typename")}
          renderItem={(itemKey: string) => (
            <List.Item key={itemKey}>
              <Typography.Text>{itemKey}</Typography.Text>: <Typography.Text type='success'>{selectedItem[itemKey]}</Typography.Text>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default ApplicationPage;
