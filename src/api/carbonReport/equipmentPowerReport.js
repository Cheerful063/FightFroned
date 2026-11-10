import request from '@/utils/request'

export function listEquipmentPowerReport(query){
	return request({
		url: '/carbonReport/equipmentPowerReport/list',
		method: 'get',
		params: query
	})
}