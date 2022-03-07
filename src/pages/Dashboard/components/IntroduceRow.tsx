import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import type { DataItem } from '../data.d';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, visitData = [] }: { loading: boolean; visitData: DataItem[] }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered
        title="用户数量 👥"

        loading={loading}
        total={() => 126560}
        footer={<Field label="今日新增" value={1} />}
        contentHeight={46}
      >
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered
        loading={loading}
        title="博客数量 📖"
        total={8846}
        footer={<Field label="今日新增：" value={1} />}
        contentHeight={46}
      >
        {/* <TinyArea
          height={46}
          autoFit
          smooth
          areaStyle={{
            fill: 'l(270) 0:rgb(151 95 228 / 10%) 0.5:rgb(151 95 228 / 60%) 1:rgb(151 95 228)',
          }}
          line={{
            color: '#975FE4',
          }}
          data={visitData.map((item) => item.y)}
        /> */}
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="网站访问量 🏃"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={<Field label="今日新增：" value={1} />}
        contentHeight={46}
      >
        {/* <TinyColumn height={46} autoFit data={visitData.map((item) => item.y)} /> */}
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="留言数量 💬"
        total="78"
        footer={
          <Field label="今日新增：" value={1} />
        }
        contentHeight={46}
      >
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
