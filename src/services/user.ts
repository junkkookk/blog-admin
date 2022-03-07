// @ts-ignore
/* eslint-disable */
import  request  from '@/utils/request';

export type User={
  id?: number
  password?: string
  username: string
  avatar: string
  status: number
  nickname: string
  gender: 0|1|2
  gmtCreate?: Date
  gmtModified?: Date
}
//更新用户状态请求参数
export type UserStatus={
  id?: number
  status: 1|0
}


/** 分页获取当前的列表 GET /api/User/page */
export const getUsers=(params: API.PageParams)=> {
  return request<API.PageResult<User>>({
    url: `/user/page`,
    method: 'post',
    data: params
  })
}

/** 根据ID获取用户 GET /api/User/page */
export const getUserById=(id: number)=> {
  return request<User>({
    url: `/user/${id}`,
    method: 'get',
  })
}

/** 添加用户 PUT /api/User */
export const addUser=(data: User)=> {
  return request<API.PageResult<any>>({
    url: `/user`,
    method: 'put',
    data
  })
}


/** 根据ID更新用户 PATCH /api/User */
export const updateUser=(data: User|UserStatus)=> {
  return request<API.PageResult<any>>({
    url: `/user`,
    method: 'patch',
    data
  })
}

/** 删除接口 DELETE /api/User */
export const removeUser=(id: number)=> {
  return request<API.PageResult<any>>({
    url: `/user/${id}`,
    method: 'delete',
  })
}
