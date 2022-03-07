import {
  GithubFilled,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import { login, oauthLogin } from '@/services/auth/api';


const Login: React.FC = (props: any) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginDTO) => {
    const res = await login(values)
    if (res.code === 200) {
      message.success("登陆成功🪅")
      localStorage.setItem("token", res.data)
      await fetchUserInfo();
      if (!history) return;
      const { query } = history.location;
      const { redirect } = query as { redirect: string }
      history.push(redirect || "/")
      return
    }
  };

  useEffect(() => {
    const { query } = props.location
    if (query.code && query.state) {
      const hide = message.info("正在登陆")
      oauthLogin({ ...query, source: 'gitee' }).then(res => {
        if (res.code === 200) {
          hide()
          message.success("登陆成功")
          localStorage.setItem("token", res.data)
          fetchUserInfo().then(res => {
            history.push("/")

          })
        }
      })
    }

  }, [])


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          className={styles.loginForm}
          logo={<></>}
          title=""
          subTitle={''}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <span key="text">其他登陆方式：</span>,
            <GithubFilled key="gitee"
              onClick={() => {
                window.location.href = "http://localhost:9001/oauth/render/gitee"
              }}
            />

          ]}
          onFinish={async (values: API.LoginDTO) => {
            await handleSubmit(values);
          }}
        >

          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
