import { Dropdown, Menu, Table, TableProps, Modal } from 'antd';
import { ButtonNoPadding } from 'components/lib';
import { Pin } from 'components/pin';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Project } from 'types/project';
import { useDeleteProject, useEditProject } from 'utils/project';
import { User } from 'types/user'
import { useProjectModal, useProjectsQueryKey } from './util';


interface ListProps extends TableProps<Project> {
	users: User[];
	refresh?: () => void;
}

export const List = ({ users, refresh, ...props }: ListProps) => {
	const { mutate } = useEditProject(useProjectsQueryKey());

	const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin })
	// const { dataSource } = props
	// console.log(dataSource?.[3]?.pin)
	return (
		<Table
			pagination={false}

			rowKey={"id"}
			columns={[
				{
					title: <Pin checked={true} />,
					render(value, project) {
						return <Pin checked={project.pin} onCheckedChange={pinProject(project.id)} />
					}
				},
				{
					title: '名称',
					render(value, project) {
						return <Link to={{ pathname: `/projects/${String(project.id)}` }}>{project.name}</Link>
					},
					sorter: (a, b) => a.name.localeCompare(b.name)
				},
				{
					title: '部门',
					dataIndex: 'organization'
				},
				{
					title: '负责人',
					render: (value, project) => users.find((user) => user.id === project.personId)?.name ||
						"未知"
				},
				{
					title: '创建时间',
					render(value, project) {
						return <span>
							{project.created ? dayjs(project.created).format('YYYY-MM-DD') : '无'}
						</span>
					}
				},
				{
					render(value, project) {
						return <More project={project}/>
					}
				}
			]}
			{...props}
		/>
	)
	};

	const More = ({ project }: { project: Project }) => {

		const { startEdit } = useProjectModal();
		const editProject = (id: number) => () => startEdit(id);
		const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey())
		const confirmDetete = (id: number) => {
			Modal.confirm({
				title: '确定删除这个项目？',
				content: '点击确定删除',
				onOk: () => {
					deleteProject({ id })
				}
			})
		}
		return (
			<Dropdown overlay={<Menu>
				<Menu.Item key={'edit'}>
					<ButtonNoPadding type='link' onClick={editProject(project.id)}>编辑</ButtonNoPadding>
					<ButtonNoPadding type='link' onClick={() => confirmDetete(project.id)}>删除</ButtonNoPadding>
				</Menu.Item>
			</Menu>}>
				<ButtonNoPadding type='link'>...</ButtonNoPadding>
			</Dropdown>
		)
	}
