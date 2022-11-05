// axios
import request from '@/utils/request'

// 获取材料出库表头
export function getMoHead(data) {
  return request({
    url: 'GetMOHead',
    method: 'post',
    data
  })
}

//获取材料出库明细
export function getMo(data) {
  return request({
    url: 'GetMO',
    method: 'post',
    data
  })
}

//材料出库 提交
export function saveMaterialOut(data) {
  return request({
    url: 'SaveMaterialOut',
    method: 'post',
    data
  })
}

//提交 拆包 
export function saveOddBarcode(data) {
  return request({
    url: 'SaveOddBarcode',
    method: 'post',
    data
  })
}

//查询发料可发料的库存明细
export function getStockOutDetail(data) {
  return request({
    url: 'GetStockOutDetail',
    method: 'post',
    data
  })
}




