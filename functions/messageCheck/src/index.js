const {Client, Databases, Query, ID} = require("node-appwrite");

module.exports = async function (req, res) {

  const client = new Client()
  .setEndpoint(req.variables["APPWRITE_ENDPOINT"])
  .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
  .setKey(req.variables["APPWRITE_API_KEY"])

  const database = new Databases(client)
  const currTime = new Date().getTime()
  const coeff = 1000 * 60 * 1
  const now = new Date(Math.floor(currTime / coeff) * coeff)
  const nowPlusOne = new Date(Math.floor((currTime + 1*60000)/ coeff) * coeff)
  
  const response = await database.listDocuments(
    'reminders',
    'reminders',
    [Query.greaterThanEqual('reminderTime', now.toISOString()),
    Query.lessThan("reminderTime", nowPlusOne.toISOString())]
  );

  const {total, documents} = response;
  // for each item in response - add to the queue collection
  if (total > 0) {

  await Promise.all(documents.map(async (reminder) => {
    const messageObject = {
      "robotJid": reminder.robotJid,
      "toJid": reminder.toJid,
      "userJid": reminder.userJid,
      "accountId": reminder.accountId,
      "content": reminder.content
    }
    
    const newDoc = await database.createDocument(
      "reminders", 
      "queue", 
      ID.unique(),
      messageObject 
    )
    console.log(newDoc)
  }));

  res.send(`I sent ${total} reminder${total > 1 ? 's':''}`, 200)


  } else {
    res.send("No reminders sent. Checking back in 1 minute.", 200)
  }


};



