'use strict';

function checkEnv(requiredEnvVars) {
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Required Environment Variable '${key}' is missing`)
    }
  }
  console.log('required variables found')
}


function updateTokenIfExpired({ username, password, baseUrl }) {

  let accessTokenExpiration = Number(pm.environment.get('expires')) || 0

  if (accessTokenExpiration < Date.now()) {
    console.log('access token has expired, fetching another one...')

    const authString = btoa(`${username}:${password}`)

    const postRequest = {
      url: `${baseUrl}/auth/tokens`,
      method: 'POST',
      header: {
        Accept: 'application/json',
        Authorization: `Basic ${authString}`
      }
    }

    pm.sendRequest(postRequest, (error, response) => {
      if (error) throw new Error(error)
      const { token, expires } = response.json();
      pm.environment.set('token', token);
      pm.environment.set('expires', expires);
    });

  } else {
    console.log('using cached token')
  }
}

(function main() {
  const username = pm.environment.get("username")
  const password = pm.environment.get("password")
  const baseUrl = pm.environment.get("baseUrl")

  checkEnv({ username, password, baseUrl })
  updateTokenIfExpired({ username, password, baseUrl })

})()