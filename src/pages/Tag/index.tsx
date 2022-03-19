import { addTag, Tag, getTags, getTagById, removeTag, updateTag } from '@/services/tag';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form, message, Modal, Tag as AntTag } from 'antd';
import { useRef, useState } from 'react';

/**
 * 添加节点
 *
 * @param fields
 */
const { confirm } = Modal;

const handleAdd = async (fields: Tag) => {
  const hide = message.loading('正在添加');

  try {
    await addTag({ ...fields });
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

const handleUpdate = async (fields: Tag) => {
  const hide = message.loading(`正在修改`);
  try {
    hide();
    await updateTag(fields);
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
    await removeTag(id);
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Tag>();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const columns: ProColumns<Tag>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      colSize: 2,
      hideInSearch: true,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      render: (_, record) => {
        return <AntTag color="magenta">{record.name}</AntTag>;
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          onClick={async () => {
            if (!record.id) return;
            const { data } = await getTagById(record.id);
            setCurrentRow(data);
            updateForm.setFieldsValue(data);
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Button
          key="remove"
          danger={true}
          onClick={() => {
            confirm({
              title: '确认删除改标签？',
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                if (!record.id) return;
                const sucess = await handleRemove(record.id);
                if (sucess) {
                  actionRef.current?.reload();
                }
              },
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
      <ProTable<Tag, API.PageParams>
        headerTitle="标签列表"
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
          const res = await getTags(params);
          return {
            data: res.data.records,
            success: res.code == 200,
            total: res.data.total,
          };
        }}
        columns={columns}
      />
      <ModalForm
        form={form}
        title="新建标签"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as Tag);
          if (success) {
            handleModalVisible(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="标签名称"
          placeholder="请输入标签名称"
          rules={[{ required: true, message: '请输入标签名称!' }]}
        />
        <ProFormDigit width={'md'} label="排序" name="sort" min={1} max={10} />
      </ModalForm>

      <ModalForm
        form={updateForm}
        title="修改标签"
        width="400px"
        visible={updateModalVisible}
        onVisibleChange={(flag) => {
          if (!flag) {
            setCurrentRow(undefined);
          }
          handleUpdateModalVisible(flag);
        }}
        onFinish={async (value) => {
          const success = await handleUpdate({ id: currentRow?.id, ...value });
          if (success) {
            setCurrentRow(undefined);
            updateForm.resetFields();
            handleUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="标签名称"
          placeholder="请输入标签名称"
          rules={[{ required: true, message: '请输入标签名称!' }]}
        />
        <ProFormDigit width={'md'} label="排序" name="sort" min={1} max={10} />
      </ModalForm>
    </PageContainer>
  );
};
