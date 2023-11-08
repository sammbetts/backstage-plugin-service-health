import React from 'react';
import { makeStyles } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

interface Props {
  activeIncident?: boolean;
}

const useStyles = makeStyles({
  incidentIcon: {
    fontSize: '2.51rem',
    fontWeight: 'bold',
  },
});

export const IncidentIcon = (props: Props) => {
  const { activeIncident } = props;
  const classes = useStyles();

  return (
    <>
      {activeIncident ? (
        <ErrorOutlineIcon
          className={classes.incidentIcon}
          style={{ color: 'red' }}
        />
      ) : (
        <CheckCircleOutlineIcon
          className={classes.incidentIcon}
          style={{ color: 'green' }}
        />
      )}
    </>
  );
};
