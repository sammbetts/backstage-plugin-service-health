export const sendSlackNotification = async (
  serviceName: string,
  incidentServiceName: string,
  incidentTime: string,
  slackWebhookUrl: string,
) => {
  const payload = {
    text: `:warning: *Service Health - Third party incident alert* :warning:
        \nAn active incident has been reported by *${serviceName}* at *${incidentTime}* affecting *${incidentServiceName}*.
        \n
        \n_Powered by Backstage Service Health Plugin_`,
  };

  fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {},
    body: JSON.stringify(payload),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Failed to send Slack notification: ${response.status}`);
    }
  });
};
