import { useState, useEffect, useRef } from "react";

export const isFalsy = (value: unknown) => value === 0 ? false : !value

export const isVoid = (value: unknown) => value === undefined || value === null || value === ''

// 在一个函数里，改变传入的对象本身不好
export const cleanObject = (object: { [key: string]: unknown }) => {
    const result = { ...object };
    Object.keys(result).forEach((key: string) => {
        
        const value = object[key]
        if (isVoid(value)) {
            Reflect.deleteProperty(result, key)
        }
    })
    return result;
}

export const useMount = (callback: () => void) => {
    useEffect(() => {
        callback()
        // eslint-disabled-next-line react-hooks/exhaustive-deps
    }, [])
}

export const useDebounce = <V>(value: V, delay?: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);
    return debouncedValue;
}


export const useArray = <T>(initialArray: T[]) => {
    const [value, setValue] = useState(initialArray)
    
    return {
        value,
        setValue,
        add: (item: T) => setValue([...value, item]),
        remove: (index: number) => {
            const newValue = [...value]
            newValue.splice(index, 1)
            setValue(newValue)
        },
        clear: () => setValue([])
    }
}

export const useDocumentTitle = (title: string, keepOnUnmount: boolean = true) => {
    const oldTitle = useRef(document.title).current;

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        return () => {
            if (!keepOnUnmount) {
                document.title = oldTitle;
            }
        }
    }, [keepOnUnmount, oldTitle])
}

export const resetRoute = () => window.location.href = window.location.origin

/**
 * 返回组件的挂在状态，如果还没挂载或者已经卸载，返回false; 反之，返回true
 */
export const useMountedRef = () => {
    const mountedRef = useRef(false)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    return mountedRef
}
