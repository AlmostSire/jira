import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { ErrorBox } from "components/lib";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useAddProject, useEditProject } from "utils/project";
import { useProjectModal, useProjectsQueryKey } from "./util";

export const ProjectModal = () => {

    const { projectModalOpen, close, editingProject, isLoading } = useProjectModal();
    const useMutateProject = editingProject ? useEditProject : useAddProject;

    const { mutate, error, isLoading: mutateLoading } = useMutateProject(useProjectsQueryKey());
    const [form] = Form.useForm()
    const onFinish = async (values: any) => {
       
        await mutate({ ...editingProject, ...values })
        form.resetFields();
        close()

    }


    useEffect(() => {

        if (editingProject) {
            form.setFieldsValue(editingProject)
        } else {

            form.resetFields();
        }

    }, [editingProject, form])

    const title = editingProject ? '编辑项目' : '创建项目'

    return (
        <Drawer
            width={'100%'}
            visible={projectModalOpen}
            onClose={close}
            forceRender
        >

            <Container>
                {
                    isLoading ? <Spin size="large" /> : <>
                        <h1>{title}</h1>
                        <ErrorBox error={error} />
                        <Form onFinish={onFinish} form={form} layout="vertical">
                            <Form.Item label="名称" name='name' rules={[{ required: true, message: '请输入项目名称' }]}>
                                <Input placeholder="请输入项目名称" />
                            </Form.Item>
                            <Form.Item label="部门" name='organization' rules={[{ required: true, message: '请输入部门名称' }]}>
                                <Input placeholder="请输入部门名称" />
                            </Form.Item>
                            <Form.Item label="负责人" name='personId' >
                                <UserSelect defaultOptionName="负责人" />
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ textAlign: 'right' }} loading={mutateLoading} type="primary" htmlType="submit">提交</Button>
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