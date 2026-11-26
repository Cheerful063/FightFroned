import request from '@/utils/request'

// 查询采购申请列表
export function listApplyAudit(query) {
  return request({
    url: '/purchase/applyAudit/list',
    method: 'get',
    params: query
  })
}

// 查询采购申请详细
export function getApplyAudit(id) {
  return request({
    url: '/purchase/applyAudit/' + id,
    method: 'get'
  })
}

// 新增采购申请
export function addApplyAudit(data) {
  return request({
    url: '/purchase/applyAudit',
    method: 'post',
    data: data
  })
}

// 修改采购申请
export function updateApplyAudit(data) {
  return request({
    url: '/purchase/applyAudit',
    method: 'put',
    data: data
  })
}

// 删除采购申请
export function delApplyAudit(id) {
  return request({
    url: '/purchase/applyAudit/' + id,
    method: 'delete'
  })
}

// 导出采购申请
export function exportApplyAudit(query) {
  return request({
    url: '/purchase/applyAudit/export',
    method: 'get',
    params: query
  })
}