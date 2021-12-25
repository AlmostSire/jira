const CracoLessPlugin = require('craco-less');
const path = require('path');
const fs = require('fs');
const dependenceDir = path.resolve(process.cwd(), './node_modules');


module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: { 
							'@primary-color': 'rgb(0, 82, 204)',
							"@font-base-size": "16px"
						},
						javascriptEnabled: true,
					},
				},
			},
		},
	],
	babel: {
		loaderOptions: {
			cacheDirectory: false
		},
		plugins: [
			[
				"import",
				{
					"libraryName": "antd",
					"libraryDirectory": "es",
					"style": true, // `style: true` 会加载 less 文件
				},
				"antd"
			],
			// [
			// 	"import",
			// 	{
			// 		"libraryName": "almost-ui",
			// 		"libraryDirectory": "dist/components",
			// 		"camel2DashComponentName": false,
			// 		"style": (name) => {
			// 			const fullPathName = `${dependenceDir}/${name}/index.less`
			// 			if (!fs.existsSync(fullPathName)) {
			// 				return false
			// 			}
			// 			return `${name}/index.less`;
			// 		}
			// 	},
			// 	"almost-ui"
			// ],
		]
	}
};