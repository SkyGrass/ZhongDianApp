// axios
import request from '@/utils/request'

// 获取发货单单据表头
export function getDispatchHead(data) {
  return request({
    url: 'GetDispatchHead',
    method: 'post',
    data
  })
}

//获取发货单明细
export function getDispatch(data) {
  return request({
    url: 'GetDispatch',
    method: 'post',
    data
  })
}

//销售出库明细
export function savebucket(data) {
  return request({
    url: 'SaveBucket',
    method: 'post',
    data
  })
}
