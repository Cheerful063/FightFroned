import request from '@/utils/request'

//查询质量追溯列表
export function listQaTrace(query){
	return request({
		url: '/mesCheck/productCheck/list',
		method: 'get',
		params: query
	})
}