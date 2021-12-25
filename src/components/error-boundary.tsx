import React from 'react'

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

interface ErrorBoundaryProps {
    fallbackRender: FallbackRender
}

interface ErrorBoundaryState {
    error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state = {
        error: null
    }
    // 当子组件抛出异常，这里会接收到并且调用
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    render() {
        const { error } = this.state
        const { children, fallbackRender } = this.props
        if (error) {
            return fallbackRender({ error })
        }
        return children
    }
}