import { Tag } from '@/services/tag';
import request from '@/utils/request';
import { Category } from './category';
export type BlogVo = {
  id?: number
  title: string
  category: Category
  recommend: boolean
  picture: string
  content?: string
  description: string
  views: number
  likes: number
  status: number
  tags?: Array<Tag>
  gmtCreate?: Date
}

export type BlogDto = {
  id?: number
  title?: string
  content: string
  categoryId?: number
  tags?: Array<number>
  description?: string
  picture?: string
  status: 0 | 1
}

/** 分页获取博客 */
export const getBlogs = (params: any) => {
  return request<API.PageResult<BlogVo>>({
    url: `/blog/page`,
    method: 'post',
    data: params
  })
}

export const getBlogList = (params: any) => {
  return request<API.PageResult<BlogVo>>({
    url: `/blog/list`,
    method: 'post',
    data: params
  })
}


/** 根据ID获取博客 */
export const getBlogById = (id: number) => {
  return request<BlogVo>({
    url: `/blog/${id}`,
    method: 'get',
  })
}

/** 添加博客 */
export const addBlog = (blog: BlogDto) => {
  return request<any>({
    url: `/blog`,
    method: 'put',
    data: blog
  })
}

/** 根据ID删除博客 */
export const removeBlog = (id: number) => {
  return request<any>({
    url: `/blog/${id}`,
    method: 'delete',
  })
}

/** 根据ID修改博客 */
export const updateBlog = (param: any) => {
  return request<any>({
    url: `/blog`,
    method: 'patch',
    data: param
  })
}