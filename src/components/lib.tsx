import styled from "@emotion/styled";
import { Button, ButtonProps, Spin, Typography } from "antd";
import { DevTools } from "jira-dev-tool";

interface Props {
    gap?: number | boolean;
    between?: boolean;
    marginBottom?: number;
}

export const Row = styled.div<Props>`
    display: flex;
    align-items: center;
    justify-content: ${props => props.between ? 'space-between' : undefined};
    margin-bottom: ${props => props.marginBottom ? props.marginBottom + 'rem' : undefined} ;
    > * {
        margin-top: 0;
        margin-bottom: 0;
        margin-right: ${props => typeof props.gap === 'number' ? props.gap + 'rem' : props.gap ? '2rem' : undefined}
    }
`

const FullPage = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const FullPageLoading = () => (
    <FullPage>
        <Spin size="large" />
    </FullPage>
)

export const FullPageError = ({ error }: { error: Error | null }) => {
    return (
        <FullPage>
            <DevTools />
            <ErrorBox error={error}/>
        </FullPage>
    )
}

// 类型守卫
const isError = (value: any): value is Error => value?.message

export const ErrorBox = ({ error }: { error: unknown }) => {
    if (isError(error)) {
        return <Typography.Text type="danger">{error?.message}</Typography.Text>
    }
    return null
}

export const ButtonNoPadding = (props: ButtonProps) => {
    return <Button style={{ padding: 0 }} {...props}/>
}
export const ScreenContainer = styled.div`
    padding: 3.2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`
