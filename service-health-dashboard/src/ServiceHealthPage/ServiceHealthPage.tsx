import React from 'react';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import {
  Button,
  Table,
  TableContainer,
  makeStyles,
  Box,
} from '@material-ui/core';
import { useHealthData } from '../utils';
import { ServiceHealth, ServiceHealthCard } from '../components';
import CircleCI from '../assets/circleci.png';
import CloudFlare from '../assets/cloudflare.png';
import Compass from '../assets/compass.png';
import Confluence from '../assets/confluence.png';
import DataDog from '../assets/datadog.png';
import GitHub from '../assets/github.png';
import GCP from '../assets/gcp.png';
import GoogleWorkspace from '../assets/googleworkspace.png';
import HashiCorp from '../assets/hashicorp.png';
import Jira from '../assets/jira.png';
import Robin from '../assets/robin.png';
import Slack from '../assets/slack.png';
import StatusPage from '../assets/statuspage.png';
import OpsGenie from '../assets/opsgenie.png';
import Vercel from '../assets/vercel.png';
import Wiz from '../assets/wiz.png';

interface Props {
  title: string;
  className?: string;
}

const useStyles = makeStyles({
  content: {
    padding: '40px 80px 40px 80px',
  },
  tableHead: {
    padding: '10px 10px 10px 105px',
  },
  table: {
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    marginBottom: '40px',
  },
  moreLink: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  tableContainer: {
    maxHeight: '280px',
    backgroundColor: 'white',
  },
  tableBorder: {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
  },
});

const icons = {
  CircleCI: CircleCI,
  Cloudflare: CloudFlare,
  Compass: Compass,
  Confluence: Confluence,
  'Datadog US1': DataDog,
  GitHub: GitHub,
  'Google Cloud Platform': GCP,
  'Google Workspace': GoogleWorkspace,
  'HashiCorp Services': HashiCorp,
  Robin: Robin,
  'Jira Software': Jira,
  Opsgenie: OpsGenie,
  Slack: Slack,
  'Atlassian Statuspage': StatusPage,
  Vercel: Vercel,
  Wiz: Wiz,
};

export const ServiceHealthDashboardPage = () => {
  const classes = useStyles();
  const healthData = useHealthData();

  return (
    <Page themeId="home">
      <Header
        title="Service Health Dashboard"
        subtitle="Ongoing incidents and status updates for third-party services."
      />
      <Content className={classes.content}>
        <Table className={classes.table}>
          {healthData &&
            healthData.services.map((service: any, index: any) => (
              <ServiceHealth
                key={index}
                serviceName={service.serviceName}
                status={service.status}
                updated={service.updated}
                link={service.link}
                icon={icons[service.serviceName as keyof typeof icons]}
                incidents={service.incidents}
                uri={service.uri}
              />
            ))}
        </Table>
      </Content>
    </Page>
  );
};

export const ServiceHealthOverviewCard = (props: Props) => {
  const { title, className } = props;
  const classes = useStyles();
  const healthData = useHealthData();

  return (
    <InfoCard title={title} className={className}>
      <Box className={classes.tableBorder}>
        <TableContainer className={classes.tableContainer}>
          <Table>
            {healthData &&
              healthData.services.map((service: any, index: any) => (
                <ServiceHealthCard
                  key={index}
                  serviceName={service.serviceName}
                  icon={icons[service.serviceName as keyof typeof icons]}
                  incidents={service.incidents}
                />
              ))}
          </Table>
        </TableContainer>
      </Box>
      <Box className={classes.moreLink}>
        <Button
          variant="contained"
          color="primary"
          href="/service-health-dashboard"
        >
          More...
        </Button>
      </Box>
    </InfoCard>
  );
};
