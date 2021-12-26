import { Kanban } from "types/kanban";
import { useTaskTypes } from "utils/task-type";
import taskIcon from 'assets/task.svg';
import bugIcon from 'assets/bug.svg'
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { Task } from "types/task";
import { CreateTask } from "./create-task";
import { useKanbansQueryKey, useTaskModal, useTasksSearchParams } from "./util";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import { forwardRef } from "react";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

const TaskTypeIcon = ({ id }: { id: number }) => {
    const { data: taskTypes } = useTaskTypes();
    const name = taskTypes?.find(tasktype => tasktype.id === id)?.name

    if (!name) {
        return null
    }
    return <img alt="" src={name === 'task' ? taskIcon : bugIcon} />
}

const TaskCard = ({ task }: { task: Task }) => {
    const { startEdit } = useTaskModal();
    const [searchParams] = useTasksSearchParams()
    return (
        <Card style={{ marginBottom: '0.5rem' }} onClick={() => startEdit(task.id)}>

            <Mark keyword={searchParams.name} name={task.name} />
            <TaskTypeIcon id={task.typeId} />
        </Card>
    )
}

export const KanbanColumn = forwardRef<HTMLDivElement,  { kanban: Kanban, allTasks: Task[] }>(({ kanban, allTasks, ...props }, ref) => {

    const tasks = allTasks?.filter(task => task.kanbanId === kanban.id)
    return (
        <Container {...props} ref={ref}>
            <Row between>
                <h3>{kanban.name}</h3>
                <More kanban={kanban} />
            </Row>
            <TaskContainer>
                <Drop type="ROW" direction="vertical" droppableId={kanban.id.toString()}>
                    <DropChild style={{ minHeight: 10 }}>
                        {tasks?.map((task, index) => (
                            <Drag key={task.id} index={index} draggableId={'task' + task.id}>
                                <div>
                                    <TaskCard task={task} />
                                </div>
                                
                            </Drag>
                            
                        ))}
                    </DropChild>
                </Drop>
               
                <CreateTask kanbanId={kanban.id} />
            </TaskContainer>

        </Container>
    )
})

const More = ({ kanban }: { kanban: Kanban }) => {
    const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
    const startDelete = () => {
        Modal.confirm({
            title: '确定删除看板吗？',
            onOk() {
                mutateAsync({ id: kanban.id })
            }
        })
    }
    const overlay = (
        <Menu>
            <Menu.Item key={'delete'} onClick={startDelete}>
                <Button type="link">删除</Button>
            </Menu.Item>
        </Menu>
    )
    return <Dropdown overlay={overlay}>
        <Button type="link">...</Button>
    </Dropdown>
}

export const Container = styled.div`
    min-width: 27rem;
    border-radius: 6px;
    background-color: rgba(244,245,247);
    display: flex;
    flex-direction: column;
    padding: 0.7rem 0.7rem;
    margin-right: 1.5rem;
`

const TaskContainer = styled.div`
    overflow: scroll;
    flex: 1;
    ::-webkit-scrollbar {
        display: none;
    }
`
