import { useState, useEffect } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export const useHealthData = () => {
  const [healthData, setHealthData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = useApi(configApiRef);
  const baseUrl = config.get('backend.baseUrl');
  const dataUrl = `${baseUrl}/api/service-health/latest`;

  useEffect(() => {
    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        setHealthData(data);
      })
      .catch(fetchError => {
        setError(`Error fetching service status: ${fetchError}`);
      });
  }, [dataUrl]);

  if (error) {
    throw new Error(error);
  }

  return healthData;
};
