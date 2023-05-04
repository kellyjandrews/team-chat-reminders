const {Client, Databases, ID} = require("node-appwrite");

module.exports = async function (req, res) {
  const currTime = new Date().getTime()
  const coeff = 1000 * 60 * 1
  const client = new Client()
  .setEndpoint(req.variables["APPWRITE_ENDPOINT"])
  .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
  .setKey(req.variables["APPWRITE_API_KEY"])
  const database = new Databases(client);
  const payload = JSON.parse(req.payload)
  const messageObject = {
    "reminderTime": new Date(Math.floor((currTime + 1*60000)/ coeff) * coeff),
    "robotJid": payload.robotJid,
    "toJid": payload.toJid,
    "userJid": payload.userJid,
    "accountId": payload.accountId,
    "content": JSON.stringify({
      "head": {
        "text": `You want me to remind you: ${payload.cmd}`
      }
    })
  }
  // send message back with confirmation button?

  // create reminder object
  await database.createDocument(
    '643c9b7553df94d74dd2', 
    '643c9b7f8130cd068b87', 
    ID.unique(),
    messageObject 
  )

  // send message back stating the reminder has been created.

  res.send('success', 201)
};


