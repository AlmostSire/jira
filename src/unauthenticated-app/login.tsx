import { Form, Input, Button } from "antd";
import { useAuth } from "context/auth-context";
import { useAsync } from "utils/use-async";

export const LoginScreen = ({ onError }: { onError: (error: Error) => void}) => {

    const { login } = useAuth();

    const { run, isLoading } = useAsync(undefined, { throwOnError: true })

    const handleSubmit = async (values: { username: string, password: string }) => {
        try {
            await run(login(values))
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
                    placeholder="密码"
                />
            </Form.Item>
            <Form.Item>
                <Button loading={isLoading} block htmlType="submit" type="primary">登录</Button>
            </Form.Item>
         
        </Form>
    )
}