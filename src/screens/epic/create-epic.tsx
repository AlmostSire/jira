import styled from '@emotion/styled'
import { Button, Drawer, DrawerProps, Form, Input, Spin } from 'antd'
import { ErrorBox } from 'components/lib';
import { useEffect } from 'react';
import { useProjectIdUrl } from 'screens/kanban/util';
import { useAddEpic } from 'utils/epic'
import { useEpicsQueryKey } from './util'

type CreateEpicProps = Pick<DrawerProps, 'visible'> & {
    onClose: () => void
}

export const CreateEpic = ({ visible, onClose }: CreateEpicProps) => {
    const { mutateAsync: addEpic, isLoading, error } = useAddEpic(useEpicsQueryKey())
    const projectId = useProjectIdUrl()
    const [form] = Form.useForm()
    const onFinish = async (values: any) => {
        await addEpic({ ...values, projectId })
        onClose()
    }
    useEffect(() => {
        form.resetFields()
    }, [form, visible])
    return (
        <Drawer
            visible={visible}
            onClose={onClose}
            forceRender
            destroyOnClose
            width={'100%'}
        >
            <Container>
                {
                    isLoading ? <Spin size="large" /> : <>
                        <h1>创建任务组</h1>
                        <ErrorBox error={error} />
                        <Form onFinish={onFinish} form={form} layout="vertical">
                            <Form.Item label="名称" name='name' rules={[{ required: true, message: '请输入任务组名称' }]}>
                                <Input placeholder="请输入任务组名称" />
                            </Form.Item>
                           
        
                            <Form.Item>
                                <Button  loading={isLoading} type="primary" htmlType="submit">提交</Button>
                            </Form.Item>
                        </Form>
                    </>
                }
            </Container>
        </Drawer>
    )
}

const Container = styled.div`
    height: 80vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`