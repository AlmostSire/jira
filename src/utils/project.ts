import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "types/project";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAddConfig, useDeleteConfig, useEditConfig } from 'utils/use-optimistic-options'

export const useProjects = (param: Partial<Project> = {}) => {
    const client = useHttp()

    return useQuery<Project[]>(
        ['projects', param],
        () => client('projects', { data: param })
    )

}

export const useProject = (id?: number) => {

    const client = useHttp()
    const mutate = useQuery<Project>(
        ['project', { id }],
        () => client(`projects/${id}`),
        {
            enabled: !!id
        }
    )

    return mutate

}

export const useEditProject = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation(
        (param: Partial<Project>) => client(`projects/${param.id}`, {
            method: 'PATCH',
            data: param
        }), useEditConfig(queryKey))


}

export const useAddProject = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation((param: Partial<Project>) => client(`projects`, {
        method: 'POST',
        data: param
    }), useAddConfig(queryKey))


}

export const useDeleteProject = (queryKey: QueryKey) => {
    const client = useHttp()

    return useMutation(
        ({ id }: { id: number }) => client(`projects/${id}`, {
            method: 'DELETE'
        }),
        useDeleteConfig(queryKey)
    )


}


