// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id: Number
    username: string
    avatar?: string
    roles: Array<string>
  };

  type AjaxResult<T> = {
    code: Number
    msg: string
    data: T
  }

  type LoginDTO = {
    username: string
    password: string
    autoLogin: boolean
  }

  interface PageParams {
    current?: number
    pageSize?: number
    sortKey?: string
    sortOrder?: 'asc' | 'desc'
  }

  interface PageResult<T> {
    total: number
    records: Array<T>
  }

}
