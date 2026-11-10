import request from '@/utils/request'

// 查询aaaaa列表
export function listOrderaaaaa(query) {
  return request({
    url: '/wms/orderaaaaa/list',
    method: 'get',
    params: query
  })
}

// 查询aaaaa详细
export function getOrderaaaaa(id) {
  return request({
    url: '/wms/orderaaaaa/' + id,
    method: 'get'
  })
}

// 新增aaaaa
export function addOrderaaaaa(data) {
  return request({
    url: '/wms/orderaaaaa',
    method: 'post',
    data: data
  })
}

// 修改aaaaa
export function updateOrderaaaaa(data) {
  return request({
    url: '/wms/orderaaaaa',
    method: 'put',
    data: data
  })
}

// 删除aaaaa
export function delOrderaaaaa(id) {
  return request({
    url: '/wms/orderaaaaa/' + id,
    method: 'delete'
  })
}

// 导出aaaaa
export function exportOrderaaaaa(query) {
  return request({
    url: '/wms/orderaaaaa/export',
    method: 'get',
    params: query
  })
}