import request from '@/utils/request'
export type Category = {
  id?: number
  name: string
  sort: number
  gmtCreate?: Date
  gmtModified?: Date
}

/** 分页获取分类 */
export const getCategories = (params: API.PageParams) => {
  const { current, pageSize } = params
  return request<API.PageResult<Category>>({
    url: `/category/page/${current}/${pageSize}`,
    method: 'post',
    data: params
  })
}
/** 添加分类 */
export const addCategory = (data: Category) => {
  return request<API.PageResult<any>>({
    url: `/category`,
    method: 'put',
    data
  })
}

/** 根据ID获取分类 */
export const getCategoryById = (id: number) => {
  return request<Category>({
    url: `/category/${id}`,
    method: 'get',
  })
}

/** 根据ID更新分类 */
export const updateCategory = (data: Category) => {
  return request<any>({
    url: `/category`,
    method: 'patch',
    data
  })
}

/** 删除接口 DELETE */
export const removeCategory = (id: number) => {
  return request<any>({
    url: `/category/${id}`,
    method: 'delete',
  })
}

/** 获取分页列表 */
export const getCategoriesList = (param: Category | null) => {
  const data = param ? param : {}
  return request<Array<Category>>({
    url: `/category/list`,
    method: 'post',
    data
  })
}
