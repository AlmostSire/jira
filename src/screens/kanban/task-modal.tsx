import { Modal, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useEditTask } from "utils/task";
import { useTaskModal, useTasksQueryKey } from "./util";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

export const TaskModal = () => {
    const [form] = useForm();

    const { editingTaskId, editingTask, close } = useTaskModal();

    const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(useTasksQueryKey())

    const onCancel = () => {
        close()
        form.resetFields();
    }

    const onOk = async () => {
        await editTask({
            ...editingTask,
            ...form.getFieldsValue()
        })
        close()
    }

    useEffect(() => {
        form.setFieldsValue(editingTask)
    }, [editingTask, form])

    return (
        <Modal
            confirmLoading={editLoading}
            title="编辑任务"
            visible={!!editingTaskId}
            onCancel={onCancel}
            onOk={onOk}
            forceRender
        >
            <Form {...layout} initialValues={editingTask} form={form}>
                <Form.Item label="任务名" name='name' rules={[{ required: true, message: '请输入任务名称' }]}>
                    <Input placeholder="请输入任务名称" />
                </Form.Item>
                <Form.Item label="经办人" name='processorId' >
                    <UserSelect defaultOptionName="负责人" />
                </Form.Item>
                <Form.Item label="类型" name='typeId' >
                    <TaskTypeSelect/>
                </Form.Item>
            </Form>
        </Modal>
    )
}