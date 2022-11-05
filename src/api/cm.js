import request from '@/utils/request'

// 点料操作的记录  表头
export function getStockOutHead(data) {
    return request({
        url: 'GetStockOutHead',
        method: 'post',
        data
    })
}

//点料可操作的单据
export function getStockOut(data) {
    return request({
        url: 'GetStockOut',
        method: 'post',
        data
    })
}

//点料 提交
export function saveCheckMaterialOut(data) {
    return request({
        url: 'SaveCheckMaterialOut',
        method: 'post',
        data
    })
}

