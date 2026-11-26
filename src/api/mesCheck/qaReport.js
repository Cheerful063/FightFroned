import request from '@/utils/request'

//查询报告列表
export function listQaReport(query){
	return request({
		url: '/report/mesCheck/productCheck/list',
		method: 'get',
		params: query
	})
}