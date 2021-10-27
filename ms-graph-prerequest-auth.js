let accessTokenExpiration = pm.environment.get('access_token_expiration') || 0

console.log(accessTokenExpiration, typeof accessTokenExpiration)

if (accessTokenExpiration < Date.now();) {
  console.log('access token has expired, fetching another one...')
  const tenant_id = pm.environment.get('tenant_id');
  const client_id = pm.environment.get('client_id');
  const client_secret = pm.environment.get('client_secret');

  const postRequest = {
    url: `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
    method: 'POST',
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      mode: 'urlencoded',
      urlencoded: [
        { key: 'grant_type', value: 'client_credentials' },
        { key: 'scope', value: 'https://graph.microsoft.com/.default' },
        { key: 'client_id', value: client_id },
        { key: 'client_secret', value: client_secret },
      ],
    },
  };

  pm.sendRequest(postRequest, (error, response) => {
    if (error) throw new Error(error)
    const { access_token, expires_in } = response.json();
    const access_token_expiration = Date.now() + expires_in * 1000;
    pm.environment.set('access_token', access_token);
    pm.environment.set('access_token_expiration', access_token_expiration);
  });
} else {
  console.log('using cached access token')
}
