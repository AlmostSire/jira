import { useProjectIdUrl } from "screens/kanban/util"

export const useEpicSearchParams = () => ({ projectId: useProjectIdUrl() })

export const useEpicsQueryKey = () => ['epics', useEpicSearchParams()]
