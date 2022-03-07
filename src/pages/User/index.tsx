import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Avatar, Switch, Modal, Form, Upload } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { addUser, getUserById, removeUser, updateUser, UserStatus } from '@/services/user';
import type { User } from "@/services/user";
import { getUsers } from "@/services/user";
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
/**
 * 添加节点
 *
 * @param fields
 */
const { confirm } = Modal

const handleAdd = async (fields: User) => {
  const hide = message.loading('正在添加');

  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 */

const handleUpdate = async (user: User | UserStatus) => {
  const hide = message.loading(`正在修改`);
  try {
    hide();
    await updateUser(user);
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (id: number) => {
  const hide = message.loading('正在删除');
  if (!id) return true;

  try {
    hide();
    await removeUser(id);
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};



const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  /** 更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const actionRef = useRef<ActionType>()
  const [currentRow, setCurrentRow] = useState<User>()
  const [selectedRowsState, setSelectedRows] = useState<User[]>([])
  /** 国际化配置 */

  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([] as Array<UploadFile>)
  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const { fileList: files } = info
    setFileList(files)
    if (files[0] && files[0].status === 'done') {
      form.setFieldsValue({ avatar: files[0].response.data })
    }
  }


  const columns: ProColumns<User>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      colSize: 2,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '昵称',
      dataIndex: 'nickname'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (_, row) => {
        const { username, avatar } = row
        return <Avatar src={avatar} alt={row.username}>
          {username}
        </Avatar>
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: { text: '👱‍♀' }, 1: { text: '👱‍♂' }, 2: { text: '🙈' }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, row) => {
        return <Switch
          checked={row.status === 1}
          checkedChildren={"on"}
          unCheckedChildren={"off"}
          onClick={() => {
            confirm({
              title: `确认${row.status == 1 ? '禁用' : '启用'}用户？`,
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                const sucess = await handleUpdate({ id: row.id, status: row.status === 1 ? 0 : 1 })
                if (sucess) {
                  actionRef.current?.reload()
                }
              }

            });
          }}
        />
      }
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          onClick={async () => {
            if (!record.id) return
            const { data } = await getUserById(record.id)
            setCurrentRow(data);
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Button key="remove" danger={true}
          onClick={async () => {
            confirm({
              title: '确认删除改用户？',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                if (!record.id) return
                const sucess = await handleRemove(record.id);
                if (sucess) {
                  actionRef.current?.reload()
                }
              }

            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<User, API.PageParams>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const res = await getUsers(params)
          return {
            data: res.data.records,
            success: res.code == 200,
            total: res.data.total
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <ModalForm
        form={form}
        title="新建用户"
        width="800px"
        visible={createModalVisible}
        initialValues={
          { gender: '1' }
        }
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as User);
          if (success) {
            handleModalVisible(false);
            form.resetFields()
            setFileList([])
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <Form.Item name="avatar" label="头像">
            <ImgCrop rotate>
              <Upload
                fileList={fileList}
                name={'file'}
                listType={'picture-card'}
                headers={{
                  "Authorization": "Bearer " + localStorage.getItem("token")
                }}
                maxCount={1}
                onChange={handleFileChange}
                action={"/api/uploadFile"}
              >
                上传头像
              </Upload>
            </ImgCrop>
          </Form.Item>
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            rules={[{ required: true, message: '请输入用户名!' }]}
          />
          <ProFormText
            width="md"
            name="nickname"
            label="昵称"
            placeholder="请输入昵称"
            rules={[{ required: true, message: '请输入昵称!' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText.Password
            width="md"
            name="password"
            label="密码"
            placeholder="请输入密码"
            rules={[{ required: true, message: '请输入用户名!' }]}
          />
          <ProFormSelect
            name="gender"
            width="md"
            label="性别"
            valueEnum={{
              0: "女",
              1: "男",
              2: "保密"
            }}
            placeholder="请选择性别"
          />
        </ProForm.Group>
      </ModalForm>


      {currentRow ? <UpdateForm
        onSubmit={async (user: User) => {
          const success = await handleUpdate({ ...user, id: currentRow.id });
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onVisableChange={(flag) => {
          if (!flag) {
            setCurrentRow(undefined)
          }
          handleUpdateModalVisible(flag)
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      /> : null}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.username && (
          <ProDescriptions<User>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.username,
            }}
            columns={columns as ProDescriptionsItemProps<User>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
