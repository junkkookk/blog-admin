import React, { useEffect, useState } from 'react';
import type { User } from "@/services/user";
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Form, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import ImgCrop from 'antd-img-crop';
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<User>;

export type UpdateFormProps = {
  onVisableChange: (flag: boolean) => void;
  onSubmit: (values: User) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<User>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  useEffect(() => {
    const { avatar } = props.values
    if (avatar) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: avatar,
      }])
    }
  }, [])
  const [fileList, setFileList] = useState([
  ] as Array<UploadFile>);
  const [form] = Form.useForm();
  const onChange = (info: UploadChangeParam<UploadFile>) => {
    const { fileList: files } = info
    setFileList(files)
    if (files[0] && files[0].status === 'done') {
      form.setFieldsValue({ avatar: files[0].response.data })
    }

  };


  const { onVisableChange } = props
  return (<>
    <ModalForm
      form={form}
      title="新建用户"
      width="800px"
      visible={props.updateModalVisible}
      initialValues={
        { ...props.values, gender: props.values.gender + '' }
      }
      onVisibleChange={onVisableChange}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <Form.Item name="avatar" label="头像" >
          <ImgCrop rotate>
            <Upload
              fileList={fileList}
              name={'file'}
              listType={'picture-card'}
              headers={{
                "Authorization": "Bearer " + localStorage.getItem("token")
              }}
              maxCount={1}
              onChange={onChange}
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
        <ProFormSelect
          name="gender"
          width="md"
          label="性别"
          valueEnum={{
            '0': "女",
            '1': "男",
            '2': "保密"
          }}
          placeholder="请选择性别"
        />
      </ProForm.Group>
    </ModalForm>
  </>);
};

export default UpdateForm;
