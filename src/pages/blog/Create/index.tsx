import { ProFormText } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Card, Divider, Form, message } from 'antd'
import { useCallback, useState, useEffect } from 'react'
import Editor from 'for-editor'
import { addBlog, BlogDto, BlogVo, getBlogById, updateBlog } from '@/services/blog'
import DetailForm from './component/DetailForm'
import { history } from 'umi'

const isSuccess = (code: Number) => {
    return 200 === code
}

const marginRight = {
    marginRight: '8px'
};


const handleAddOrUpdate = async (fields: BlogDto) => {
    const isAdd = fields.id ? false : true
    const str = isAdd ? '添加' : '修改'
    const hide = message.loading(`正在${str}`);

    try {

        const { code } = isAdd ? await addBlog({ ...fields }) : await updateBlog({ ...fields });
        hide();
        message.success(`${str}成功`);
        return isSuccess(code)
    } catch (error) {
        hide();
        message.error(`${str}请重试！`);
        return false;
    }
};

function CreateOrUpdatePage(props: any) {

    useEffect(() => {
        const id = props.location.query.id
        if (id) {
            getBlogById(id).then(res => {
                console.log(res.data);
                const { data } = res
                if (!data.content) return
                form.setFieldsValue(data)
                setContent(data.content)
                setCurrentBlog(data)
            })
        }
    }, [])
    const [form] = Form.useForm()
    const [content, setContent] = useState("开始编辑");
    const [currentBlog, setCurrentBlog] = useState<BlogVo>()

    const onChange = useCallback((value: string) => {
        setContent(value);
    }, []);
    const [formVisible, setFormVisible] = useState<boolean>(false)

    return (
        <PageContainer>
            <Card>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        setFormVisible(true)
                    }}
                >
                    <ProFormText
                        width="lg"
                        name="title"
                        label="博客标题"
                        placeholder="请输入博客标题"
                        rules={[{ required: true, message: '请输入博客标题!' }]}
                    />
                    <Divider />
                    <Editor
                        style={{
                            "marginBottom": "24px"
                        }}
                        subfield={true}
                        preview={true}
                        addImg={(file) => {
                            console.log(file);
                        }}
                        value={content} onChange={onChange} />
                    {
                        <Form.Item wrapperCol={{ offset: 0, span: 16 }} >
                            <Button
                                style={marginRight} type="primary" htmlType="submit"
                            >
                                {currentBlog?.status == 0 ? '发布' : currentBlog?.id ? '完成' : '发布'}
                            </Button>
                            {
                                currentBlog?.status !== 1 ?
                                    <Button type="dashed" style={marginRight} onClick={async () => {
                                        form.validateFields().then(async res => {
                                            const blog = { ...form.getFieldsValue(), content, status: 0 }
                                            if (currentBlog?.id) {
                                                blog.id = currentBlog.id
                                            }
                                            const flag = await handleAddOrUpdate(blog)
                                            if (flag) history.push("/blog/list")
                                        }).catch(e => {
                                            message.error("未填写标题")
                                        })
                                    }}>
                                        保存
                                    </Button>
                                    : ''
                            }
                            <Button style={marginRight} htmlType="reset">
                                重置
                            </Button>
                        </Form.Item>
                    }

                </Form>
            </Card>
            <DetailForm
                modalVisible={formVisible}
                onVisableChange={(flag) => {
                    setFormVisible(flag)
                }}
                values={currentBlog || {}}
                onSubmit={async (values) => {
                    const blog = {
                        ...values,
                        ...form.getFieldsValue(),
                        content,
                        status: 1,
                        recommend: values.recommend ? 1 : 0,
                    }
                    if (currentBlog?.id) {
                        blog.id = currentBlog.id
                    }

                    const flag = await handleAddOrUpdate(blog)
                    if (flag) history.push("/blog/list")
                }}
            />
        </PageContainer>
    )
}

export default CreateOrUpdatePage