const {Client, Databases, ID, Users} = require("node-appwrite")
const { Intl, Temporal } = require('@js-temporal/polyfill')
const chrono = require("chrono-node")

module.exports = async function (req, res) {
  const currTime = new Date().getTime()
  const coeff = 1000 * 60 * 1
  const client = new Client()
  .setEndpoint(req.variables["APPWRITE_ENDPOINT"])
  .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
  .setKey(req.variables["APPWRITE_API_KEY"])
  const database = new Databases(client);
  const users = new Users(client);


  const payload = JSON.parse(req.payload)
  const userPrefs = await users.getPrefs(payload.userId)
  const dateParse = chrono.parse(payload.cmd)
  const start = dateParse[0].start.date();

  const zdt = Temporal.Instant.from(start.toISOString()).toZonedDateTimeISO(userPrefs.timezone);
  const parts = new Intl.DateTimeFormat("en-US", {timeZoneName: "short",}).formatToParts(zdt);

  const timeZoneName = parts[14].value
  const dateParseTZ = chrono.parse(payload.cmd, { timezone: timeZoneName });
  let reminderText = payload.cmd.substring(0, dateParse[0].index - 1)

  if (reminderText.includes("/remind ")) {
    reminderText = reminderText.substring(8)
  }
  const messageObject = {
    "reminderTime": dateParseTZ[0].start.date().toISOString(),
    "robotJid": payload.robotJid,
    "toJid": payload.toJid,
    "userJid": payload.userJid,
    "accountId": payload.accountId,
    "content": JSON.stringify({
      "head": {
        "text": "Reminder"   
      },
      "body": [
        {
          "type": "message",
          "text": reminderText
        }
      ]
    })
  }

  await database.createDocument(
    'reminders', 
    'reminders', 
    ID.unique(),
    messageObject 
  )

  res.send('success', 201)
};


async function handleNotifications(payload) {

  let pd;

  let start = dateParse[0].start.date();

  if (timeZone?.getPlainDateTimeFor) {
    pd = timeZone.getPlainDateTimeFor(start.toISOString());
  } else {
    pd = start.toISOString()
  }

  resp.reminderTime = pd.toString();
  resp.reminderText = payload.cmd.substring(0, dateParse[0].index - 1);

  console.log(resp)
  
}