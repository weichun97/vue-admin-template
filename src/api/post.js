import request from '@/utils/request'

export function query(params) {
  return request({
    url: '/post/query',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/post/save',
    method: 'post',
    data: params
  })
}

export function update(params, id) {
  return request({
    url: `/post/update/${id}`,
    method: 'put',
    data: params
  })
}

export function remove(id) {
  return request({
    url: `/post/remove/${id}`,
    method: 'delete'
  })
}
