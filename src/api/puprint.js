
// axios
import request from '@/utils/request'

// 获取采购到货单据表头
export function getPuArrivalHead2(data) {
    return request({
        url: 'GetPuArrivalHead2',
        method: 'post',
        data
    })
}

// 获取采购进货可打印的单据
export function getPuArrival2(data) {
    return request({
        url: 'GetPuArrival2',
        method: 'post',
        data
    })
}

//根据包号获取条码
export function getYCLBarcode(data) {
    return request({
        url: 'GetYCLBarcode',
        method: 'post',
        data
    })
}

// 提交采购进货打印 
export function savePurArrPrint(data) {
    return request({
        url: 'SavePurArrPrint',
        method: 'post',
        data
    })
}

// 提交标签补打印
export function saveRepeatBarcode(data) {
    return request({
        url: 'SaveRepeatBarcode',
        method: 'post',
        data
    })
}


