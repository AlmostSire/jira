import { useMemo } from "react"
import { useProject } from "utils/project"
import { useUrlQueryParam } from "utils/url"

export const useProjectsSearchParams = () => {
    const [param, setParam] = useUrlQueryParam(['name', 'personId'])
    const searchParam = useMemo(() => ({
        ...param,
        personId: Number(param.personId) || undefined
    }), [param])
    
    return [
        searchParam,
        setParam
    ] as const
}

export const useProjectsQueryKey = () => {
    const [params] = useProjectsSearchParams();
    return ['projects', params]
}

export const useProjectModal = () => {
  
    const [{ projectCreate, editingProjectId }, setParam] = useUrlQueryParam(['projectCreate', 'editingProjectId']);
    
    const {data: editingProject, isLoading, } = useProject(Number(editingProjectId));

    const open = () => setParam({ projectCreate: true });
    const close = () => {
        setParam({ projectCreate: undefined, editingProjectId: undefined })
    }

    const startEdit = (id: number) => setParam({ editingProjectId: id })
    
    
    return {
        projectModalOpen: projectCreate === 'true' || !!editingProjectId,
        open,
        close,
        startEdit,
        editingProject,
        isLoading,
    }
}