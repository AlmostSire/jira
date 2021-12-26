import { Button, List, Modal } from "antd";
import { Row, ScreenContainer } from "components/lib"
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjejctInUrl } from "screens/kanban/util";
import { Epic } from "types/epic";
import { useDocumentTitle } from "utils";
import { useDeleteEpic, useEpics } from "utils/epic";
import { useTasks } from "utils/task";
import { CreateEpic } from "./create-epic";
import { useEpicSearchParams, useEpicsQueryKey } from "./util";

export const EpicScreen = () => {
    useDocumentTitle('任务组')
    const { data: currentProject } = useProjejctInUrl();
    const { data: epics = [] } = useEpics(useEpicSearchParams());
    const { data: tasks = [] } = useTasks({ projectId: currentProject?.id });
    const {mutateAsync} = useDeleteEpic(useEpicsQueryKey());
    const [epicCreateOpen, setEpicCreateOpen] = useState(false)
    const startDelete = (epic: Epic) => {
        Modal.confirm({
            title: `确定删除项目组：${epic.name}`,
            onOk() {
                mutateAsync({ id: epic.id })
            }
        })
    }
    return (
        <ScreenContainer>
            <Row between>
                <h1>{currentProject?.name}任务组</h1>
                <Button onClick={() => setEpicCreateOpen(true)}>创建任务组</Button>
            </Row>
            
            <List style={{ overflow: 'scroll' }} dataSource={epics} itemLayout="vertical" renderItem={epic => (
                <List.Item>
                    <List.Item.Meta
                        title={<Row between>
                            <span>{epic.name}</span>
                            <Button onClick={() => startDelete(epic)}>删除</Button>
                        </Row>}
                        description={<div>
                            <div>开始时间：{dayjs(epic.start).format('YYYY-MM-DD')}</div>
                            <div>结束时间：{dayjs(epic.end).format('YYYY-MM-DD')}</div>
                        </div>}
                    />
                    <div>
                        {tasks?.filter(task => task.epicId === epic.id).map(task => (
                            <Link to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`} key={task.id}>{task.name}</Link>
                        ))}
                    </div>
                </List.Item>
            )} />
            <CreateEpic visible={epicCreateOpen} onClose={() => setEpicCreateOpen(false)}/>
        </ScreenContainer>

    )
}