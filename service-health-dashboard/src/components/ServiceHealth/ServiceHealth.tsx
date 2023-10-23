import React from 'react';
import {
  StyledTableRow,
  StyledTableExpandedRow,
  StyledCardTableRow,
} from '../StyledTable';
import { convertToUKDateTimeFormat } from '../../utils';

interface TableProps {
  serviceName: string;
  status: string;
  updated: string;
  link: string;
  icon: string;
  incidents: [];
  uri?: string;
}

interface CardProps {
  serviceName: string;
  icon: string;
  incidents: [];
}

export const ServiceHealth = (props: TableProps) => {
  const { serviceName, status, updated, link, icon, incidents, uri } = props;
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledTableRow
        service={serviceName}
        status={status}
        updated={convertToUKDateTimeFormat(updated)}
        link={link}
        icon={icon}
        hasIncidents={incidents.length > 0}
        onToggle={handleToggle}
        isOpen={open}
      />

      {incidents.map((incident: any) => (
        <StyledTableExpandedRow
          key={incident.id}
          incidentServiceName={
            incident.service_name || // google
            incident.services || // slack
            incident.components[0].name // all others
          }
          incidentStatus={
            <>
              <b>{incident.status_impact || incident.type || incident.name}</b>
              <br />
              {incident.external_desc ||
                incident.title ||
                incident.incident_updates[0].body}
            </>
          }
          incidentUpdated={convertToUKDateTimeFormat(
            incident.modified || incident.date_updated || incident.updated_at,
          )}
          incidentLink={
            incident.uri
              ? `${uri}/${incident.uri}`
              : incident.url || incident.shortlink
          }
          isOpen={open}
        />
      ))}
    </>
  );
};

export const ServiceHealthCard = (props: CardProps) => {
  const { serviceName, icon, incidents } = props;

  return (
    <>
      {incidents && (
        <StyledCardTableRow
          service={serviceName}
          icon={icon}
          hasIncidents={incidents.length > 0}
        />
      )}
    </>
  );
};
