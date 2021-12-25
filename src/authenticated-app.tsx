import styled from "@emotion/styled"
import { Button, Dropdown, Menu } from "antd"
import { ButtonNoPadding, Row } from "components/lib"
import { useAuth } from "context/auth-context"
import { ProjectListScreen } from "screens/project-list"
import { ProjectScreen } from 'screens/project'
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg'
import { Routes, Route } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { resetRoute } from 'utils'
import { ProjectModal } from "screens/project-list/project-modal"
import { ProjectPopover } from "screens/project-list/project-popover"


export const AuthenticatedApp = () => {

    return (
        <Container>
            <Router>
                <PageHeader />
                <Main>
                    <Routes>
                        <Route path={'projects'} element={<ProjectListScreen />} />
                        <Route path={'projects/:projectId/*'} element={<ProjectScreen />} />
                        <Route index element={<ProjectListScreen />} />
                    </Routes>
                </Main>
                <ProjectModal />
            </Router>
        </Container>
    )
}

const PageHeader = () => {

    return (
        <Header between={true}>
            <HeaderLeft gap={true}>
                <ButtonNoPadding type="link" onClick={resetRoute}>
                    <SoftwareLogo
                        width={'18rem'}
                        color="rab(38, 132, 255)"
                    />
                </ButtonNoPadding>
                <ProjectPopover />
                <span>用户</span>
            </HeaderLeft>
            <HeaderRight>
                <User />

            </HeaderRight>
        </Header>
    )
}

const User = () => {
    const { logout, user } = useAuth();
    return (
        <Dropdown overlay={<Menu>
            <Menu.Item key="logout">
                <Button type="link" onClick={logout}>登出</Button>
            </Menu.Item>
        </Menu>}>
            <Button type="link" onClick={e => e.preventDefault()}>
                Hi, {user?.name}
            </Button>
        </Dropdown>
    )
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 6rem 1fr;
    height: 100vh;
`

const Header = styled(Row)`
    padding: 0.32rem;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
    z-index: 1;
`

const HeaderLeft = styled(Row)`
    display: flex;
    align-items: center;
`

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
`

const Main = styled.main`
    display: flex;
    
`