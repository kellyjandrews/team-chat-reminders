const {Client,Users,Databases} = require("node-appwrite");
const fetch = require('node-fetch');
const { Headers } = require('node-fetch');


module.exports = async function (req, res) {

async function getAuthToken() {
  const HASHED_ZOOM_KEY = Buffer.from(`${req.variables["ZOOM_CLIENT_ID"]}:${req.variables["ZOOM_CLIENT_SECRET"]}`).toString('base64');

  const meta = {
    "Authorization": `Basic ${HASHED_ZOOM_KEY}`
  }
  const headers = new Headers(meta);

  const options = {
    method: 'POST',
    headers: headers,
  }

  const payload = JSON.parse(req.payload)
  const response = await fetch(`https://zoom.us/oauth/token?grant_type=authorization_code&code=${payload.code}`, options);
	const data = await response.json()
  return data
}


async function getUser() {
  const auth_token = await getAuthToken()
  const meta = {
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${auth_token['access_token']}`
  }
  const headers = new Headers(meta);

const options = {
  method: 'GET',
  headers: headers
}

try {
  const response = await fetch(`https://api.zoom.us/v2/users/me`, options);
  const data = await response.json()
  return {data, auth: auth_token}
} catch (error) {
  console.error(error)
}
return
}


  const client = new Client()
  .setEndpoint(req.variables["APPWRITE_ENDPOINT"])
  .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
  .setKey(req.variables["APPWRITE_API_KEY"])
  const users = new Users(client);
  const databases = new Databases(client);
  let user = await getUser()
  const {
    id, display_name, email, first_name, last_name, language, timezone
  } = user.data;

  try {
    await users.create(id);
    await users.updateName(id, display_name)
    await users.updateEmail(id, email)
    await users.updatePrefs(id, {
      refreshToken: user.auth.refresh_token,
      timezone: timezone,
      language: language,
      firstName: first_name,
      lastName : last_name
    })
    await users.updateEmailVerification(id, true)

  } catch (error) {
   console.error(error) 
  }

  res.send('user created', 201)
};