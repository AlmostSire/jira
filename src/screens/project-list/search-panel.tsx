import { Form, Input } from "antd";
import { UserSelect } from "components/user-select";
import { Project } from "types/project";
import { User } from "types/user";



interface SearchPanelProps {
	users: User[];
	param: Partial<Pick<Project, 'name' | 'personId'>>;
	setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPannel = ({ param, setParam, users }: SearchPanelProps) => {
	
	return (
		<Form layout="inline" style={{ marginBottom: '2rem' }}>
			<Form.Item>
				<Input
					placeholder="项目名"
					value={param.name}
					onChange={(e) =>
						setParam({
							...param,
							name: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item>
				<UserSelect
					defaultOptionName="负责人"
					
					style={{ width: 100 }}
					value={param.personId}
					onChange={(e) =>
						setParam({
							...param,
							personId: e,
						})
					}
				/>
				
			</Form.Item>
		</Form>
	);
};
