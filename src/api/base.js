import api from './index'
// axios
import request from '@/utils/request'

// 获取存货
export function getInventory(data) {
  return request({
    url: 'Bucket',
    method: 'post',
    data
  })
}

// 获取桶类别信息
export function getBucketType(data) {
  return request({
    url: 'BucketType',
    method: 'post',
    data
  })
}


// 获取桶状态信息
export function getBucketStatus(data) {
  return request({
    url: 'BucketStatus',
    method: 'post',
    data
  })
}

// 获取客户信息
export function getCustomer(data) {
  return request({
    url: 'Customer',
    method: 'post',
    data
  })
}

//获取供应商
export function getVendor(data) {
  return request({
    url: 'Vendor',
    method: 'post',
    data
  })
}
