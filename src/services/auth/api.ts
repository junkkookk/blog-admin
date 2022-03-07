// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 获取当前的用户 GET /api/currentUser */
export const currentUser = () => {
  return request<API.CurrentUser>({
    url: '/me',
    method: 'get',
  })
}
/** 登陆 POST /api/login */
export const login = (params: API.LoginDTO) => {
  return request<string>({
    url: '/login',
    method: 'post',
    data: params
  })
}

/** 登陆 POST /api/login */
export const outLogin = () => {
  return request<string>({
    url: '/logout',
    method: 'get',
  })
}

/** 第三方登陆 */
export const oauthLogin = (params: any) => {
  return request<string>({
    url: `/oauth/callback/${params.source}`,
    method: 'get',
    params
  })
}
