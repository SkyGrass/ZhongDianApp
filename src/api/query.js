// axios
import request from '@/utils/request'

//桶生命周期查询
export function getBucketRecord(data) {
  return request({
    url: 'GetBucketRecord',
    method: 'post',
    data
  })
}


