import styled from "@emotion/styled";
import { Spin } from "antd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { ScreenContainer } from "components/lib";
import { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Kanban } from "types/kanban";
import { Task } from "types/task";
import { useDebounce, useDocumentTitle } from "utils";
import { useKanbans, useRecorderKanban } from "utils/kanban"
import { useRecorderTask, useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPannel } from "./search-panal";
import { TaskModal } from "./task-modal";
import { useKanbanSearchParams, useKanbansQueryKey, useProjejctInUrl, useTasksQueryKey, useTasksSearchParams } from "./util";


export const KanbanScreen = () => {
    useDocumentTitle('看板列表')
    const { data: currentProject } = useProjejctInUrl();
    const { data: kanbans = [], isLoading: kanbanIsLoading } = useKanbans(useKanbanSearchParams());
    const [searchParams] = useTasksSearchParams();
    const debounceName = useDebounce(searchParams.name, 200)
    const { data: allTasks = [], isLoading: taskIsloading } = useTasks({ ...searchParams, name: debounceName });

    const isLoading = taskIsloading || kanbanIsLoading
    

    const onDragEnd = useDragEnd(kanbans, allTasks)
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <ScreenContainer>
                <h1>{currentProject?.name}</h1>
                <SearchPannel />
                {
                    isLoading ?
                        <Spin size="large" /> :
                        <ColumnsContainer>
                            <Drop  type="COLUMN" direction="horizontal" droppableId="kanban">
                                <DropChild style={{ display: 'flex'}}>
                                {
                                        kanbans?.map((kanban, index) => (
                                            <Drag key={kanban.id} draggableId={'kanban' + kanban.id} index={index}>
                                                <KanbanColumn

                                                    kanban={kanban}
                                                    allTasks={allTasks}
                                                />
                                            </Drag>
                                        ))
                                    }
                                </DropChild>
                                
                            </Drop>
                            <CreateKanban />
                        </ColumnsContainer>


                }

                <TaskModal />
            </ScreenContainer>
        </DragDropContext>
    )
}

export const useDragEnd = (kanbans: Kanban[], tasks: Task[]) => {
    
    const {mutateAsync: reorderKanban} = useRecorderKanban(useKanbansQueryKey())
    const {mutateAsync: reorderTask} = useRecorderTask(useTasksQueryKey())
    return useCallback(({source, destination, type}: DropResult) => {
        
        if (!destination) return 
        // 看板排序
        if (type === 'COLUMN') {
           
            const fromId = kanbans?.[source.index].id
            const toId = kanbans?.[destination.index].id
            if (!fromId || !toId || fromId === toId) {
                return
            }
            const type = destination.index > source.index ? 'after' : 'before'

            reorderKanban({fromId, referenceId: toId, type})
        }
       
        if (type === 'ROW') {
            
            const fromKanbanId = +source.droppableId;
            const toKanbanId = +destination.droppableId;
            
            // if (fromKanbanId === toKanbanId) {
            //     return 
            // }
            const type = destination.index > source.index ? 'after' : 'before'
            const fromTask = tasks.filter(task => task.kanbanId === fromKanbanId)[source.index]
            const toTask = tasks.filter(task => task.kanbanId === toKanbanId)[destination.index]
            
            if (fromTask?.id === toTask?.id) {
                return
            }
            reorderTask({
                fromId: fromTask?.id,
                referenceId: toTask?.id,
                fromKanbanId,
                toKanbanId,
                type
            })

        }
    }, [kanbans, reorderKanban, tasks, reorderTask])
}

export const ColumnsContainer = styled.div`
    display: flex;
    flex: 1;
    overflow-x: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
`