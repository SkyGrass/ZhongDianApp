// axios
import request from '@/utils/request'

//库存查询
export function getCurrentStock(data) {
  return request({
    url: 'GetCurrentStock',
    method: 'post',
    data
  })
}

//库存台账
export function getCurrentStockDetail(data) {
  return request({
    url: 'GetCurrentStockDetail',
    method: 'post',
    data
  })
}


