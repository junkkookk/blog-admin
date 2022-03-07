import { history } from 'umi';
import { BlogVo, getBlogList, getBlogs, removeBlog } from '@/services/blog';
import { CloudSyncOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Image, Modal, Switch, Tag as AntTag, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import DraftTable from './component/DraftTable';
const { confirm } = Modal
export default () => {
    const actionRef = useRef<ActionType>()
    const [draftData, setDraftData] = useState<any>()
    const [drafVisible, setDraftVisble] = useState(false)


    const columns: ProColumns<BlogVo>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            colSize: 2,
            hideInSearch: true,
        },
        {
            title: '文章标题',
            dataIndex: 'title',
            render: (_, record) => {
                return <Tooltip title={record.title}>
                    <AntTag color="magenta">
                        {record.title.length > 8 ? record.title.substring(0, 7) + '...' : record.title}
                    </AntTag>
                </Tooltip>
            }
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (_, record) => {
                const { category } = record
                return category ? category.name : ''
            }
        },
        {
            title: '封面',
            dataIndex: 'picture',
            hideInSearch: true,
            render: (_, record) => {
                return <Image height={"50px"} src={record.picture} alt={record.title} />
            }
        },
        {
            title: '描述',
            dataIndex: 'description',
            hideInSearch: true,
            render: (_, record) => {
                return <Tooltip title={record.description}>
                    {record.description.length > 15 ? record.description.substring(0, 14) + '...' : record.description}
                </Tooltip>
            }
        },
        {
            title: '是否推荐',
            dataIndex: 'recommended',
            hideInSearch: true,
            render: (_, record) => {
                return <Switch
                    checked={record.recommend === true}
                    checkedChildren={"是"}
                    unCheckedChildren={"否"}
                    onClick={() => {
                    }}
                />

            }
        },
        // {
        //     title: '文章状态',
        //     dataIndex: 'status',
        //     hideInSearch: true,
        //     render: (_, record) => {
        //         return record.status === 0 ? '草稿' : '已发布'
        //     }
        // },
        {
            title: '点赞数',
            dataIndex: 'likes',
            hideInSearch: true
        },
        {
            title: '阅读数',
            dataIndex: 'views',
            hideInSearch: true
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
            render: (_, record) => {
                const buttons = [
                    <Button key="edit"
                        onClick={() => {
                            history.push(`/blog/create?id=${record.id}`)
                        }}
                    >
                        编辑
                    </Button>,
                    <Button key="remove" danger={true}
                        onClick={() => {
                            confirm({
                                title: '确认删除该博客？',
                                icon: <ExclamationCircleOutlined />,
                                onOk: async () => {
                                    if (!record.id) return
                                    const { code } = await removeBlog(record.id);
                                    if (code === 200) {
                                        actionRef.current?.reload()
                                    }
                                }
                            })
                        }}
                    >
                        删除
                    </Button>,]

                return buttons
            },
        },
    ];

    return (
        <PageContainer >
            <ProTable<BlogVo, API.PageParams>
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
                            history.push("/blog/create")
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                    <Button
                        type="dashed"
                        key="primary"
                        onClick={async () => {
                            const res = await getBlogList({ status: 0 })
                            setDraftData(res.data)
                            setDraftVisble(true)
                        }}
                    >
                        <CloudSyncOutlined /> 草稿箱
                    </Button>,
                ]}
                request={async (params) => {
                    const res = await getBlogs({ ...params, status: 1 })
                    return {
                        data: res.data.records,
                        success: res.code == 200,
                        total: res.data.total
                    }
                }}
                columns={columns}
            />

            <DraftTable
                visible={drafVisible}
                handleCancel={() => {
                    setDraftVisble(false)
                }}
                data={draftData}
                handleDeleteBLog={async (id: number) => {
                    confirm({
                        title: '确认删除该博客？',
                        icon: <ExclamationCircleOutlined />,
                        onOk: async () => {
                            const { code } = await removeBlog(id);
                            if (code === 200) {
                                const res = await getBlogList({ status: 0 })
                                setDraftData(res.data)
                            }
                        }
                    })
                }}
            />
        </PageContainer>
    );
};
