// 引入 request 文件
import request from './request.js'
 
// 获取日历信息
export const pageStudyInfo = (params) => {
	return request({
		url: '/study/studyInfo/page',
		method: 'get',
		data: params,
        header: {} // 自定义
	})
}
