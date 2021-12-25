import { Button, Form, Input } from "antd";
import { useAuth } from "context/auth-context";
import { useAsync } from "utils/use-async";

export const RegisterScreen = ({ onError }: { onError: (error: Error) => void}) => {

    const { register } = useAuth()

    const { run, isLoading } = useAsync(undefined, { throwOnError: true })

    const handleSubmit = async ({ cpassword, ...values }: { username: string, password: string, cpassword: string }) => {
        if (cpassword !== values.password) {
            onError(new Error('请确认两次输入的密码相同'))
            return
        }
        try {
            await run(register(values))
        } catch (e) {
            onError(e as Error)
        }
    }
    return (
        <Form onFinish={handleSubmit}>
           
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input 
                    placeholder="用户名"
                />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input 
                    type="password"
                    placeholder="密码"
                />
            </Form.Item>
            <Form.Item name="cpassword" rules={[{ required: true, message: '请输入密码' }]}>
                <Input 
                    type="password"
                    placeholder="确认密码"
                />
            </Form.Item>
            <Form.Item>
                <Button loading={isLoading} block htmlType="submit" type="primary">注册</Button>
            </Form.Item>
         
        </Form>
    )
}