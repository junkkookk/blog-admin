import { GithubFilled, LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import { login, oauthLogin } from '@/services/auth/api';

const redirectUrl = 'http://localhost:8000/login';
const Login: React.FC = (props: any) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginDTO) => {
    const res = await login(values);
    if (res.code === 200) {
      message.success('η»ιζεπͺ');
      localStorage.setItem('token', res.data);
      await fetchUserInfo();
      if (!history) return;
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      history.push(redirect || '/');
      return;
    }
  };

  useEffect(() => {
    const { query } = props.location;
    if (query.code && query.state) {
      const hide = message.info('ζ­£ε¨η»ι');
      oauthLogin({ ...query, source: 'gitee', redirectUrl }).then((res) => {
        if (res.code === 200) {
          hide();
          message.success('η»ιζε');
          localStorage.setItem('token', res.data);
          fetchUserInfo().then(() => {
            history.push('/');
          });
        }
      });
    }
  }, []);

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
            <span key="text">εΆδ»η»ιζΉεΌοΌ</span>,
            <GithubFilled
              key="gitee"
              onClick={() => {
                window.location.href =
                  'http://localhost:9001/oauth/render/gitee?redirectUrl=' + redirectUrl;
              }}
            />,
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
              placeholder={'η¨ζ·ε'}
              rules={[
                {
                  required: true,
                  message: 'η¨ζ·εζ―εΏε‘«ι‘ΉοΌ',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'ε―η '}
              rules={[
                {
                  required: true,
                  message: 'ε―η ζ―εΏε‘«ι‘ΉοΌ',
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
              θͺε¨η»ε½
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              εΏθ?°ε―η  ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
