import React, { useState } from 'react';
import { Button, Flex, Form, Input, Modal, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const RecruiterPage: React.FC = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      <Flex gap="small" justify="space-between" style={{
        marginBottom: '16px',
      }} wrap>
        <Paragraph style={{ fontSize: '22px'}} strong>
          Recruiters
        </Paragraph>
        <Button
          type="primary"
          size='large'
          style={{
            backgroundColor: '#001529',
          }}
          onClick={() => setModal1Open(true)}
        >
          Add Recruiter
        </Button>
      </Flex>
      <Table<DataType> columns={columns} dataSource={data} />
      <Modal
        title="Assign new recruiter"
        centered
        open={modal1Open}
        okText="Add"
        cancelText="Cancel"
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
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
      </Form>
      </Modal>
    </>
  );
};

export default RecruiterPage;