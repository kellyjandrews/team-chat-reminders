const {Client,Databases} = require("node-appwrite");
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
 
  const response = await fetch('https://zoom.us/oauth/token?grant_type=client_credentials', options);
	const data = await response.json()
  return data
}


async function sendMessage() {
  const auth_token = await getAuthToken(req)
 
  const meta = {
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${auth_token['access_token']}`
  }
  const headers = new Headers(meta);
  const message = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"])
  const body = {
    "robot_jid": message.robotJid,
    "to_jid": message.toJid,
    "user_jid": message.userJid,
    "account_id": message.accountId,
    "content": JSON.parse(message.content)
  }

const options = {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(body),
}

try {
  const response = await fetch('https://api.zoom.us/v2/im/chat/messages', options);
  const data = await response.json()
  console.log(data)
} catch (error) {
  console.error(error)
}
return
}


  try {
    const client = new Client()
    .setEndpoint(req.variables["APPWRITE_ENDPOINT"])
    .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.variables["APPWRITE_API_KEY"])
  
  const database = new Databases(client);
  
  await sendMessage()
  res.send('success')
  } catch (error) {
    res.json({'error': error.toString()})
  }

};