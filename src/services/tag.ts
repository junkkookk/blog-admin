import { Tag } from 'antd';
import request from '@/utils/request';

export type Tag = {
  id?: number
  name: string
  sort: number
  gmtCreate?: Date
  gmtModified?: Date
}


/** 分页获取标签 */
export const getTags = (params: API.PageParams) => {
  const { current, pageSize } = params
  return request<API.PageResult<Tag>>({
    url: `/tag/page/${current}/${pageSize}`,
    method: 'post',
    data: params
  })
}
/** 添加标签 */
export const addTag = (data: Tag) => {
  return request<API.PageResult<any>>({
    url: `/tag`,
    method: 'put',
    data
  })
}

/** 根据ID获取标签 */
export const getTagById = (id: number) => {
  return request<Tag>({
    url: `/tag/${id}`,
    method: 'get',
  })
}

/** 根据ID更新标签 */
export const updateTag = (data: Tag) => {
  return request<any>({
    url: `/tag`,
    method: 'patch',
    data
  })
}

/** 删除接口 DELETE */
export const removeTag = (id: number) => {
  return request<any>({
    url: `/tag/${id}`,
    method: 'delete',
  })
}

/** 获取分页列表 */
export const getTagList = (param: Tag | null) => {
  const data = param ? param : {}
  return request<Array<Tag>>({
    url: `/tag/list`,
    method: 'post',
    data
  })
}