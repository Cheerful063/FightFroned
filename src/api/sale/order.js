import request from '@/utils/request'

// 查询销售订单列表
export function listOrder(query) {
  return request({
    url: '/sale/saleOrder/list',
    method: 'get',
    params: query
  })
}