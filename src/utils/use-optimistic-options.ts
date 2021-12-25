import { QueryKey, useQueryClient } from "react-query";
import { Project } from "types/project";

export const useConfig = <T>(queryKey: QueryKey, callback: (target: T, old?: T[]) => T[]) => {
    const queryClient = useQueryClient();

    return {
        onSuccess: () => queryClient.invalidateQueries(queryKey),
        async onMutate(target: T) {
            console.log(target)
            const previousItems = queryClient.getQueriesData(queryKey);
            queryClient.setQueryData(queryKey, (old?: T[]) => {
                const newData = callback(target, old)
                console.log(newData)
                return newData
            })
            return { previousItems }
        },
        onError: (error: unknown, newItem: T, context: any) => {
            if (error) queryClient.setQueryData(queryKey, context.previousItems)
        }
    }
}

export const useDeleteConfig = (queryKey: QueryKey) => useConfig<Partial<Project>>(queryKey, (target, old) => old?.filter(item => item.id !== target.id) || [])
export const useEditConfig = (queryKey: QueryKey) => useConfig<Partial<Project>>(queryKey, (target, old) => old?.map(item => item.id === target.id ? {...item, ...target} : item) || [target])
export const useAddConfig = (queryKey: QueryKey) => useConfig<Partial<Project>>(queryKey, (target, old) => old ? [...old, target] : [target])