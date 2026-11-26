import request from '@/utils/request'

// 查询入库申请列表
export function listInWarehouseApplyAudit(query) {
  return request({
    url: '/wmsApply/inWarehouseApplyAudit/list',
    method: 'get',
    params: query
  })
}

// 查询入库申请详细
export function getInWarehouseApplyAudit(id) {
  return request({
    url: '/wmsApply/inWarehouseApplyAudit/' + id,
    method: 'get'
  })
}

// 新增入库申请
export function addInWarehouseApplyAudit(data) {
  return request({
    url: '/wmsApply/inWarehouseApplyAudit',
    method: 'post',
    data: data
  })
}

// 修改入库申请
export function updateInWarehouseApplyAudit(data) {
  return request({
    url: '/wmsApply/inWarehouseApplyAudit',
    method: 'put',
    data: data
  })
}

// 删除入库申请
export function delInWarehouseApplyAudit(id) {
  return request({
    url: '/wmsApply/inWarehouseApplyAudit/' + id,
    method: 'delete'
  })
}

// 导出入库申请
export function exportInWarehouseApplyAudit(query) {
  return request({
    url: '/wmsApply/inWarehouseApplyAudit/export',
    method: 'get',
    params: query
  })
}

//查询供应商列表
export function listSupplier(query){
	return request({
		url: '/scm/supplier/list',
		method: 'get',
		params: query
	})
}