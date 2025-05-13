import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useAuth } from '../../contexts/auth-context';
import { dashboardSummaryApi } from '../../apis/dashboard-api';

const { Title } = Typography;

const WelcomePage = () => {
  const { user } = useAuth();
  const [dashboardStatistics, setDashboardStatistics] = useState({
    companies: 'N/A',
    jobs: 'N/A',
    seekers: 'N/A',
    applications: 'N/A',
  });
  const fetchStats = async () => {
    const stats = await dashboardSummaryApi();
    setDashboardStatistics({
      ...dashboardStatistics,
      ...stats,
    });
  };
  useEffect(() => {
    fetchStats();
  }, []);
  const StatTitle = ({ text }: { text: string }) => (
    <Typography.Text>{text}</Typography.Text>
  );
  return (
    <div>
      <Typography>
        <Title>Welcome back {user.user.name}</Title>
      </Typography>
      <div
        style={{
          padding: 10,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title={<StatTitle text={'Companies'} />}
                value={dashboardStatistics.companies}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title={<StatTitle text={'Jobs'} />}
                value={dashboardStatistics.jobs}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title={<StatTitle text={'Applications'} />}
                value={dashboardStatistics.applications}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title={<StatTitle text={'Seekers'} />}
                value={dashboardStatistics.seekers}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WelcomePage;
