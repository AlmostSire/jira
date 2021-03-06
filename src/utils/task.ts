import { QueryKey, useMutation, useQuery } from "react-query";
import { Task } from "types/task";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { SortProps } from "./kanban";
import { useAddConfig, useDeleteConfig, useReorderConfig, useReorderTaskConfig } from "./use-optimistic-options";

export const useTasks = (param?: Partial<Task>) => {
    const client = useHttp();
    return useQuery<Task[]>(['tasks', param], () => 
        client('tasks', { data: cleanObject(param || {}) })
    )
}

export const useTask = (id: number) => {
    const client = useHttp();

    return useQuery<Task>(
        ['task', { id }],
        () => client(`tasks/${id}`),
        {
            enabled: Boolean(id)
        }
    )
}


export const useAddTask = (queryKey: QueryKey) => {
    const client = useHttp();
    return useMutation(
        (params: Partial<Task>) =>
            client('tasks', {
                data: params,
                method: 'POST',
            }),
        useAddConfig(queryKey)
    )
}

export const useEditTask = (queryKey: QueryKey) => {
    const client = useHttp();
    return useMutation(
        (params: Partial<Task>) =>
            client(`tasks/${params.id}`, {
                data: params,
                method: 'PATCH',
            }),
        useAddConfig(queryKey)
    )
}

export const useDeleteTask = (queryKey: QueryKey) => {
    const client = useHttp();

    return useMutation(
        ({ id }: { id: number }) =>
            client(`tasks/${id}`, {
                method: "DELETE",
            }),
        useDeleteConfig(queryKey)
    );
};

export const useRecorderTask = (queryKey: QueryKey) => {
    const client = useHttp()
    return useMutation(
        (params: SortProps) => client('tasks/reorder', {
            data: params,
            method: 'POST'
        }),
        useReorderTaskConfig(queryKey)
    )
}
