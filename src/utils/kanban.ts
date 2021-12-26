import { QueryKey, useMutation, useQuery } from "react-query"
import { Kanban } from "types/kanban"
import { cleanObject } from "utils"
import { useHttp } from "./http"
import { useAddConfig, useDeleteConfig, useReorderKanbanConfig } from "utils/use-optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
    const client = useHttp();

    return useQuery<Kanban[]>(['kanbans', param], () =>
        client('kanbans', { data: cleanObject(param || {}) })
    )

}

export const useAddKanban = (queryKey: QueryKey) => {
    const client = useHttp();

    return useMutation(
        (params: Partial<Kanban>) =>
            client(`kanbans`, {
                data: params,
                method: "POST",
            }),
        useAddConfig(queryKey)
    );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
    const client = useHttp();

    return useMutation(
        ({ id }: { id: number }) =>
            client(`kanbans/${id}`, {
                method: "DELETE",
            }),
        useDeleteConfig(queryKey)
    );
};

export interface SortProps {
    fromId: number,
    referenceId: number,
    type: 'before' | 'after',
    fromKanbanId: number
    toKanbanId: number
}

export const useRecorderKanban = (queryKey: QueryKey) => {
    const client = useHttp()
    return useMutation(
        (params: Partial<SortProps>) => client('kanbans/reorder', {
            data: params,
            method: 'POST'
        }),
        useReorderKanbanConfig(queryKey)
    )
}

