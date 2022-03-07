import { BlogVo } from '@/services/blog';
import { getCategoriesList } from '@/services/category';
import { getTagList } from '@/services/tag';
import ProForm, { ModalForm, ProFormSelect, ProFormSwitch, ProFormTextArea } from '@ant-design/pro-form'
import { Button, Form, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react'
export type DetailFormProps = {
  onVisableChange: (flag: boolean) => void;
  onSubmit: (values: BlogVo) => Promise<void>;
  modalVisible: boolean;
  values: Partial<BlogVo>;
};
const onPreview = async (file: UploadFile) => {
  let src = file.response.data;
  const image = new Image();
  if (src)
    image.src = src;
  const imgWindow = window.open(src);
  if (imgWindow)
    imgWindow.document.write(image.outerHTML);
};
const DetailForm: React.FC<DetailFormProps> = (props) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([] as Array<UploadFile>)

  useEffect(() => {
    console.log("执行");
    const { picture } = props.values
    if (picture) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: picture,
      }])
    }
  }, [props.values])

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const { fileList: files } = info

    setFileList(files)
    if (files[0] && files[0].status === 'done') {
      form.setFieldsValue({ picture: files[0].response.data })
    }
  }
  return (
    <ModalForm
      form={form}
      title="额外信息"
      width="600px"
      visible={props.modalVisible}
      initialValues={
        props.values
      }
      onVisibleChange={props.onVisableChange}
      onFinish={props.onSubmit}
      submitter={{
        render: (props, dom) => {
          const buttons = [
            <Button type="default" key="rest" onClick={() => props.form?.resetFields()}>
              重置
            </Button>,
            <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
              提交
            </Button>,
          ]

          return buttons
        }
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="categoryId"
          label="分类"
          request={async () => {
            const { data } = await getCategoriesList(null)
            return data.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })
          }}
          placeholder="请选择分类"
          rules={[{ required: true, message: '请选择分类' }]}
        />
        <ProFormSelect
          width="md"
          mode="multiple"
          name="tags"
          label="标签"
          request={async () => {
            const { data } = await getTagList(null)
            return data.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })
          }}
          placeholder="请选择标签"
          rules={[{ required: true, message: '请选择标签' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSwitch
          width="md"
          label="是否推荐"
          name="recommend"
          checkedChildren={"是"}
          unCheckedChildren={"否"}
        />

      </ProForm.Group>
      <ProForm.Group>
        <Form.Item name="picture" label="封面">
          <Upload
            headers={{
              "Authorization": "Bearer " + localStorage.getItem("token")
            }}
            action={"/api/uploadFile"}
            listType="picture-card"
            className="upload-list-inline"
            maxCount={1}
            fileList={fileList}
            onChange={handleFileChange}
            onPreview={onPreview}
          >
            上传封面
          </Upload>
        </Form.Item>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="xl"
          name="description"
          label="博客简介"
        >

        </ProFormTextArea>
      </ProForm.Group>
    </ModalForm>
  )
}

export default DetailForm