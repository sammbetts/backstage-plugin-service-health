import React from 'react';
import {
  Avatar,
  Collapse,
  IconButton,
  Link,
  Table,
  TableCell,
  TableRow,
  Typography,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { IncidentIcon } from '../IncidentIcon';

interface Incident {
  incidentServiceName: string;
  incidentStatus: string | any;
  incidentUpdated: string;
  incidentLink: string;
  isOpen?: boolean;
}
interface TableProps {
  service: string;
  status: string;
  updated: string;
  link: string;
  icon: string;
  hasIncidents?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface CardProps {
  service: string;
  icon: string;
  hasIncidents?: boolean;
}

const useStyles = makeStyles({
  service: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  serviceIcon: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  incidentService: {
    marginLeft: '88px',
    fontWeight: 'bold',
  },
  moreLink: {
    width: '100px',
    fontSize: '1rem',
  },
  icon: {
    width: '3rem',
    height: '3rem',
  },
  incident: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const StyledTableCell = withStyles(() =>
  createStyles({
    root: {
      padding: '0 40px 0 15px',
      width: '350px',
      borderBottom: '1.5px groove white',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  }),
)(TableCell);

const StyledTableCellExpanded = withStyles(() =>
  createStyles({
    root: {
      padding: '15px 40px 15px 15px',
      color: 'grey',
      width: '350px',
      borderTop: '1.5px groove #F3F3F3',
    },
  }),
)(TableCell);

const StyledSmallTableCell = withStyles(() =>
  createStyles({
    root: {
      padding: '0 20px 0 10px',
      color: 'grey',
      width: '150px',
      borderBottom: '1.5px groove white',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  }),
)(TableCell);

const StyledSmallTableCellExpanded = withStyles(() =>
  createStyles({
    root: {
      padding: '10px',
      color: 'grey',
      width: '150px',
      borderTop: '1.5px groove #F3F3F3',
    },
  }),
)(TableCell);

const StyledCardTableCell = withStyles(() =>
  createStyles({
    root: {
      padding: '5px 30px 5px 30px',
      fontSize: '1rem',
      borderBottom: '1.5px groove darkGrey',
    },
  }),
)(TableCell);

export const StyledCardTableRow = (props: CardProps) => {
  const { service, icon, hasIncidents } = props;

  return (
    <TableRow style={{ color: 'black' }}>
      <StyledCardTableCell>
        <Avatar alt="logo" src={icon} />
      </StyledCardTableCell>
      <StyledCardTableCell>
        <Typography style={{ fontWeight: 'bold' }}>{service}</Typography>
      </StyledCardTableCell>
      <StyledCardTableCell>
        <IncidentIcon activeIncident={hasIncidents} />
      </StyledCardTableCell>
    </TableRow>
  );
};

export const StyledTableExpandedRow = (props: Incident) => {
  const {
    incidentServiceName,
    incidentStatus,
    incidentUpdated,
    incidentLink,
    isOpen,
  } = props;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell style={{ padding: 0 }} colSpan={4}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Table>
            <StyledTableCellExpanded>
              <div className={classes.incidentService}>
                {incidentServiceName}
              </div>
            </StyledTableCellExpanded>
            <StyledTableCellExpanded>{incidentStatus}</StyledTableCellExpanded>
            <StyledSmallTableCellExpanded>
              {incidentUpdated}
            </StyledSmallTableCellExpanded>
            <StyledSmallTableCellExpanded>
              <div className={classes.moreLink}>
                <Link href={incidentLink} target="_blank">
                  More...
                </Link>
              </div>
            </StyledSmallTableCellExpanded>
          </Table>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export const StyledTableRow = (props: TableProps) => {
  const {
    service,
    status,
    updated,
    link,
    icon,
    hasIncidents,
    onToggle,
    isOpen,
  } = props;
  const classes = useStyles();

  return (
    <>
      <TableRow>
        <StyledTableCell className={classes.service}>
          <div className={classes.serviceIcon}>
            <IconButton
              style={{ margin: '0 10px 0 10px' }}
              href={link}
              target="_blank"
            >
              <Avatar className={classes.icon} alt="logo" src={icon} />
            </IconButton>
            {service}
          </div>
        </StyledTableCell>
        <StyledTableCell>
          {hasIncidents ? (
            <>
              <Typography style={{ color: 'red' }}>
                Ongoing Incidents
              </Typography>
            </>
          ) : (
            <>
              {status ? (
                <Typography>{status}</Typography>
              ) : (
                <Typography>Normal Service</Typography>
              )}
            </>
          )}
        </StyledTableCell>
        <StyledSmallTableCell>{updated}</StyledSmallTableCell>
        <StyledSmallTableCell>
          <div className={classes.incident}>
            <IncidentIcon activeIncident={hasIncidents} />
            {hasIncidents && (
              <IconButton onClick={onToggle}>
                {isOpen ? (
                  <KeyboardArrowUpIcon className={classes.icon} />
                ) : (
                  <KeyboardArrowDownIcon className={classes.icon} />
                )}
              </IconButton>
            )}
          </div>
        </StyledSmallTableCell>
      </TableRow>
    </>
  );
};
