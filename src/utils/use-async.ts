import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils";

export interface State<D> {
    error: Error | null;
    data: D | null;
    status: 'idle' | 'loading' | 'error' | 'success'
}

export const defaultState: State<null> = {
    error: null,
    data: null,
    status: 'idle'
}

const defaultConfig = {
    throwOnError: false
}

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
    const mountedRef = useMountedRef()
    return useCallback((...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0), [dispatch, mountedRef])   
}

export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) => {
    const [state, dispatch] = useReducer((state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }), {
        ...defaultState,
        ...initialState
    })

    const safeDispatch = useSafeDispatch(dispatch);
    

    const [retry, setRetry] = useState(() => () => {});
    

    const config = {
        ...defaultConfig,
        ...initialConfig
    }

    const setData = useCallback((data: D) => safeDispatch({
        data,
        status: 'success',
        error: null
    }), [safeDispatch])

    const setError = useCallback((error: Error) => safeDispatch({
        data: null,
        status: 'error',
        error
    }), [safeDispatch])

    const run =  useCallback((promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
        if (!promise || !promise.then) {
            throw new Error('请传入 Promise 类型数据')
        }

        // 保存当前请求
        setRetry(() => () => {
            if (runConfig?.retry) {
                run(runConfig.retry(), runConfig)
            }
        })

        safeDispatch({ status: 'loading' })

        return promise.then(data => {
            
            setData(data)
            
            return data
        }).catch(error => {
            setError(error)
            
            if (config.throwOnError) {
                return Promise.reject(error)
            }
            return error
        })
    }, [config.throwOnError, setData, setError, safeDispatch])

    

    return {
        isIdle: state.status === 'idle',
        isLoading: state.status === 'loading',
        isSuccess: state.status === 'success',
        isError: state.status === 'error',
        setData,
        setError,
        run,
        retry,
        ...state
    }
}