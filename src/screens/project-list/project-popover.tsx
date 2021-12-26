import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd"
import { ButtonNoPadding } from "components/lib";
import { useProjects } from "utils/project";
import { useProjectModal } from "./util";

export const ProjectPopover = () => {
    const {data: projects, refetch } = useProjects();
    const pinnedProjects = projects?.filter(project => project.pin)

    const {open} = useProjectModal()


    const content = <ContentContainer>
        <Typography.Text type="secondary">收藏项目</Typography.Text>
        <List>
            {pinnedProjects?.map(project => <List.Item key={project.id}>
                <List.Item.Meta title={project.name}/>
            </List.Item>)}
        </List>
        <Divider/>
        <ButtonNoPadding 
            type="link"
            
            onClick={open}
        >
            创建项目
        </ButtonNoPadding>
    </ContentContainer>
    return (
        <Popover 
            placement="bottom" 
            content={content} 
            onVisibleChange={() => refetch()}
        >
            项目
        </Popover>
    )
}

const ContentContainer = styled.div`
    min-width: 30rem;
`