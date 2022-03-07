import { history } from '@/.umi/core/history'
import { Button, Modal, Table } from 'antd'



function DraftTable(props: any) {

    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: '草稿标题',
            dataIndex: 'title'
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_: any, record: any) => {
                return [<Button type="dashed" key="view" onClick={() => {
                    history.push("/blog/create/?id=" + record.id)
                }}>
                    查看
                </Button>, <Button style={{ marginLeft: "8px" }} type="default" key="delete" danger onClick={() => {
                    props.handleDeleteBLog(record.id)
                }}>
                    删除
                </Button>]
            },
        }
    ]


    return (
        <Modal
            title="草稿箱"
            visible={props.visible}
            footer={null}
            onCancel={props.handleCancel}
            width="800px"
        >
            <Table
                dataSource={props.data}
                columns={columns}
                rowKey={record => record.id}
                scroll={{ y: 240 }}
                pagination={false}
            />
        </Modal>
    )
}

export default DraftTable