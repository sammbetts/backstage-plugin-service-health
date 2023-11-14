export const sendSlackNotification = async (
  serviceName: string,
  incidentTime: string,
  incidentServiceName: string,
  incidentUrl: string,
  slackWebhookUrl: string,
) => {
  const payload = {
    text: `:warning: *Service Health - Third party incident alert* :warning:
        \nAn active incident has been reported by *${serviceName}* at *${incidentTime}* affecting *${incidentServiceName}*.
        \n
        \n_<${incidentUrl}|Click to see more...>_`,
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
