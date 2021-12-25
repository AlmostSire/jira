import { useMemo } from "react";
import { useLocation } from "react-router"
import { useProject } from "utils/project";
import { useTask } from "utils/task";
import { useUrlQueryParam } from "utils/url";

export const useProjectIdUrl = () => {
    const { pathname } = useLocation();
    const id = pathname.match(/projects\/(\d+)/)?.[1]
    return Number(id)
}

export const useProjejctInUrl = () => {
    const id = useProjectIdUrl();
    return useProject(id)
}

export const useKanbanSearchParams = () => ({ projectId: useProjectIdUrl() })

export const useKanbansQueryKey = () => ['kanbans', useKanbanSearchParams()]

export const useTasksSearchParams = () => {
    const projectId = useProjectIdUrl()
    const [param, setParam] = useUrlQueryParam([
        'name',
        'typeId',
        'processorId',
        'tagId'
    ])

    const searchParam = useMemo(() => ({
        projectId,
        typeId: Number(param.typeId) || undefined,
        processorId: Number(param.processorId) || undefined,
        tagId: Number(param.tagId) || undefined,
        name: param.name
    }), [projectId, param])

    return [searchParam, setParam] as const
}

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()[0]]

export const useTaskModal = () => {
    const [{ editingTaskId }, setParam] = useUrlQueryParam(['editingTaskId']);
    
    const {data: editingTask, isLoading} = useTask(Number(editingTaskId));


    // const open = () => setParam({ projectCreate: true });
    const close = () => {
        setParam({ editingTaskId: undefined })
    }

    const startEdit = (id: number) => setParam({ editingTaskId: id })
    
    
    return {
        editingTaskId,
        //open,
        close,
        startEdit,
        editingTask,
        isLoading,
    }
}
