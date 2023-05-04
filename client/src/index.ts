import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createHmac } from 'node:crypto'
import { Client, Functions } from 'node-appwrite'
import { IncomingHttpHeaders } from 'node:http'


interface ZoomHeaders extends IncomingHttpHeaders {
  'x-zm-request-timestamp'?: 'string';
  'x-zm-signature'?: 'string';
}

interface ZoomBotNotificationBody {
  "event": string,
  "payload": {
    "accountId": string,
    "channelName": string
    "cmd": string,
    "name": string,
    "robotJid": string,
    "timestamp": number,
    "toJid": string,
    "userId": string,
    "userJid": string,
    "userName": string
  }
}

const {
  ZOOM_SECRET_TOKEN = '',
  APPWRITE_ENDPOINT = '',
  APPWRITE_PROJECT = '',
  APPWRITE_API_KEY = '',
  BOT_JID = ''
} = process.env

const app = express()
const port = process.env.PORT || 4000

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY)

const functions = new Functions(client);

app.use(bodyParser.json())

app.get('/redirect', (req: Request, res: Response) => {
  res.redirect(301, `https://zoom.us/launch/chat?jid=robot_${BOT_JID}`)
})

function validateWebhook<T>(headers: ZoomHeaders, body: ZoomBotNotificationBody) {
  const message = `v0:${headers['x-zm-request-timestamp']}:${JSON.stringify(body)}`
  const hashForVerify = createHmac('sha256', ZOOM_SECRET_TOKEN).update(message).digest('hex')
  const signature = `v0=${hashForVerify}`
  return headers['x-zm-signature'] === signature;
}

async function exectuteFunction(functionId: string, data?: any) {
  await functions.createExecution(functionId, JSON.stringify(data))
}

async function handleNotifications(payload: ZoomBotNotificationBody["payload"]) {
  exectuteFunction('createReminder', payload)
}

app.post('/remind', (req: Request, res: Response) => {

  let response;
  const isValid = validateWebhook(req.headers, req.body)

  if (!isValid) response = { message: 'Unauthorized request to Reminders for Zoom Team Chat.', status: 401 };
  response = { message: 'Authorized request to Reminders for Zoom Team Chat.', status: 200 }
  console.log(response.message)
  res.status(response.status)
  res.json(response)


  switch (req.body.event) {
    case 'bot_notification':
      handleNotifications(req.body.payload)
      break;
    case 'bot_installed':
      console.log('installed')
      console.log(req.body)
      break;
    case 'app_deauthorized':
      console.log(req.body)
      break;
    default:
      break;
  }

  return
})



app.listen(port, () => console.log(`Reminders for Zoom Team Chat listening on port ${port}.`))