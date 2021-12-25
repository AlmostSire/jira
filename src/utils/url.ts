import { useMemo } from 'react';
import { useSearchParams, URLSearchParamsInit } from 'react-router-dom'
import { cleanObject } from 'utils';

export const useUrlQueryParam = <T extends string>(keys: T[]) => {
    const [searchParams, setSearchParam] = useSearchParams();
    
    const param = useMemo(
        () => keys.reduce(
            (prev, key) => ({
                ...prev,
                [key]: searchParams.get(key)
            }),

            {} as { [key in T]: string }
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams]
    )
    
    const setParam = (params: Partial<{ [key in T]: unknown }>) => {
        const o = cleanObject({
             ...Object.fromEntries(searchParams), 
             ...params 
        }) as URLSearchParamsInit
        return setSearchParam(o)
    }
    
    return [param, setParam] as const

}

