import { Form, Input, Button } from "antd";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { Task } from "types/task";
import { useMount } from "utils";
import { useTasksSearchParams } from "./util";

export const SearchPannel = () => {
    const [searchParams, setSearchParams] = useTasksSearchParams();

    const [form] = Form.useForm()

    const reset = () => {
        setSearchParams({
            typeId: undefined,
            processorId: undefined,
            tagId: undefined,
            name: undefined
        })
        form.resetFields()
    }
    const handleChange = (value: Task) => {
        console.log(value)
        setSearchParams(value)
    }
    useMount(() => {
        
        form.resetFields()
        form.setFieldsValue(searchParams)
    })
    return (
        <Form
            initialValues={searchParams}
            form={form}
            onValuesChange={handleChange}
            layout="inline" 
            style={{ marginBottom: '2rem' }}
        >
            <Form.Item name={'name'}>
                <Input
                    placeholder="任务名"
                    style={{ width: '20rem' }}

                />
            </Form.Item>
            <Form.Item name={'processorId'}>
                <UserSelect
                    defaultOptionName="经办人"
                />

            </Form.Item>
            <Form.Item name={'typeId'}>
                <TaskTypeSelect
                    defaultOptionName="类型"
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    onClick={reset}
                >清除筛选器</Button>
            </Form.Item>
        </Form>
    );
};
