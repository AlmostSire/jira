import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContainer } from "components/lib";
import { useDebounce, useDocumentTitle } from "utils";
import { useKanbans } from "utils/kanban"
import { useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPannel } from "./search-panal";
import { TaskModal } from "./task-modal";
import { useKanbanSearchParams, useProjejctInUrl, useTasksSearchParams } from "./util";


export const KanbanScreen = () => {
    const { data: currentProject } = useProjejctInUrl();
    const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(useKanbanSearchParams());
    const [searchParams] = useTasksSearchParams();
    const debounceName = useDebounce(searchParams.name, 200)
    const {data: allTasks = [], isLoading: taskIsloading} = useTasks({ ...searchParams, name: debounceName });

    const isLoading = taskIsloading || kanbanIsLoading
    useDocumentTitle('看板列表')

    return (
        <ScreenContainer>
            <h1>{currentProject?.name}</h1>
            <SearchPannel />
            {
                isLoading ?
                    <Spin size="large" /> :
                    <ColumnsContainer>
                        {
                            kanbans?.map(kanban => (
                                <KanbanColumn
                                    key={kanban.id}
                                    kanban={kanban}
                                    allTasks={allTasks}
                                />
                            ))
                        }
                        <CreateKanban />
                    </ColumnsContainer>
            }

            <TaskModal />
        </ScreenContainer>
    )
}

export const ColumnsContainer = styled.div`
    display: flex;
    flex: 1;
    overflow-x: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
`