
import { SearchPannel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "utils";
import styled from "@emotion/styled";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectsSearchParams } from "./util";
import { ButtonNoPadding, ErrorBox, Row } from "components/lib";


export const ProjectListScreen = () => {

    const [param, setParam] = useProjectsSearchParams()

    const debouncedParam = useDebounce(param, 300)

    const { isLoading, error, data: list } = useProjects(debouncedParam)
   
    const { data: users } = useUsers()

    const {open} = useProjectModal()

    useDocumentTitle('项目列表', false)

    return (
        <Container>
            <Row between>
                <h1>项目列表</h1>
                <ButtonNoPadding
                    onClick={open}
                >
                    创建项目
                </ButtonNoPadding>
            </Row>
            
           
            <SearchPannel param={param} setParam={setParam} users={users || []} />

            <ErrorBox error={error}/>

            <List 
                dataSource={list || []} 
                users={users || []} 
                loading={isLoading} 
                
            />
        </Container>
    );
};

ProjectListScreen.whyDidYouRender = false

const Container = styled.div`
    padding: 3.2rem;
    width: 100%;
`