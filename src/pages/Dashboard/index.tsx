import { FC, useState } from 'react';
import { Link, useModel } from 'umi';
import { Suspense } from 'react';

import { GridContent, PageContainer } from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';

import type { AnalysisData } from './data.d';
import { Avatar, Card, Col, Row, Skeleton, Spin, DatePicker } from 'antd';
import styles from './style.less'
import EditableLinkGroup from './components/EditableLinkGroup';
import ViewChart from './components/ViewChart';
type DashboardProps = {
  dashboard?: AnalysisData;
  loading?: boolean;
};
const { RangePicker } = DatePicker

const links = [
  {
    title: '博客🗒',
    href: '',
  },
  {
    title: '用户👤',
    href: '',
  },
  {
    title: '留言🔈',
    href: '',
  },
  {
    title: '博客首页🏠',
    href: '',
  },
];


const PageHeaderContent: FC<{ currentUser: Partial<API.CurrentUser> }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.username}
        </div>
        <div>
          越努力，越幸运 ——ikun💌
        </div>
      </div>
    </div>
  );
};


const Dashboard: FC<DashboardProps> = () => {
  const { initialState } = useModel('@@initialState');

  const [loading] = useState(false)

  const loadingJsx = (
    <span >
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loadingJsx;
  }

  const { currentUser } = initialState;
  if (!currentUser || !currentUser.username) {
    return loadingJsx;
  }

  return (
    <PageContainer
      header={{
        title: null
      }}
      content={
        <PageHeaderContent
          currentUser={currentUser}
        />
      }
    >
      <GridContent
      >
        <>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={[]} />
          </Suspense>
        </>
      </GridContent>
      <GridContent>
        <>
          <Row gutter={24}>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={18}
            >
              <Card
                style={{ marginBottom: 24 }}
                title="访问分析"
                bordered={false}
                bodyStyle={{ padding: 0 }}
                extra={<RangePicker />}
              >
                <ViewChart />
              </Card>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={6}
            >
              <Card
                style={{ marginBottom: 24 }}
                title="快速开始 / 便捷导航"
                bordered={false}
                bodyStyle={{ padding: 0 }}
              >
                <EditableLinkGroup onAdd={() => { }} links={links} linkElement={Link} />
              </Card>
            </Col>
          </Row>
        </>
      </GridContent>



    </PageContainer>
  );
};

export default Dashboard;
