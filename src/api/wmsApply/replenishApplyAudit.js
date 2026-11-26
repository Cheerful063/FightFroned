import request from '@/utils/request'

// 查询补货申请列表
export function listReplenishApplyAudit(query) {
  return request({
    url: '/wmsApply/replenishApplyAudit/list',
    method: 'get',
    params: query
  })
}

// 查询补货申请详细
export function getReplenishApplyAudit(id) {
  return request({
    url: '/wmsApply/replenishApplyAudit/' + id,
    method: 'get'
  })
}

// 新增补货申请
export function addReplenishApplyAudit(data) {
  return request({
    url: '/wmsApply/replenishApplyAudit',
    method: 'post',
    data: data
  })
}

// 修改补货申请
export function updateReplenishApplyAudit(data) {
  return request({
    url: '/wmsApply/replenishApplyAudit',
    method: 'put',
    data: data
  })
}

// 删除补货申请
export function delReplenishApplyAudit(id) {
  return request({
    url: '/wmsApply/replenishApplyAudit/' + id,
    method: 'delete'
  })
}

// 导出补货申请
export function exportReplenishApplyAudit(query) {
  return request({
    url: '/wmsApply/replenishApplyAudit/export',
    method: 'get',
    params: query
  })
}