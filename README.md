# Reminders App for Zoom Team Chat

> **Note**
> 
> The following sample application is a personal, open-source project shared by the app creator and not an officially supported Zoom Video Communications, Inc. sample application. Zoom Video Communications, Inc., its employees and affiliates are not responsible for the use and maintenance of this application. Please use this sample application for inspiration, exploration and experimentation at your own risk and enjoyment. You may reach out to the app creator and broader Zoom Developer community on https://devforum.zoom.us/ for technical discussion and assistance, but understand there is no service level agreement support for this application. Thank you and happy coding!


This guide will walk you through creating a Reminder App for Zoom Team Chat, using the open-source backend, Appwrite. The goal is to improve your productivity by taking your Apps for Team Chat to the next level, as well as learn the features of Apps for Team Chat and the AppsSDK. 

## Prerequisites
- A Zoom account with permissions to create apps.

## Creating a User-Level Team Chat App

### Step 1: Enablement of Team Chat Apps
The account owner or admin must activate view and edit permissions for Team Chat Apps. Go to User Management > Roles > Role Settings > Advanced features.

### Step 2: Creating a User-Level Team Chat App
Login into your Zoom account and navigate to the Zoom Marketplace where you can see all available app types. Here, you will create a User-Level Team Chat App. Fill in required fields such as Contact Name, Email, OAuth Redirect URLs, etc. 

### Step 3: Adding Scopes
In the Scopes tab, add the scope user:read, which will be used to make an API call to our Get a user endpoint.

### Step 4: Enabling Features
Navigate to the Features tab and enable the Team Chat Subscription under the Zoom Client Features section. Here, provide a Bot endpoint URL (both for development and production) and append the slash command “reminder” at its end (leave it blank for now; we'll come back once ngrok is up and running).

**Note:** Since “reminder” is already taken as a command, use unique combinations like reminder01 or remindme.

Once these changes are saved, credentials (Bot JID) will be generated for both Development and production modes.

## Setting Up Appwrite for Backend:

Appwrite is an open-source backend platform that simplifies complex tasks required for building apps while ensuring security.

## Prerequisites:
1. A running Appwrite instance (cloud or self-hosted). 
2. Appwrite CLI.
3. Reminders Repo.

## Setting Up Appwrite:

Create a new project with an API key and add the following scopes: 
 + auth.users.read
 + auth.users.write
 + databases - all
 + functions - all

Then download CLI and login into appwrite. Add API key and project key using following commands:

```
appwrite client --endpoint https://cloud.appwrite.io/v1
appwrite client --key [API Key]
appwrite client --projectId [Project Key]
```

Next, navigate to ./reminders/appwrite.json_sample file in sample app directory & rename it as appwrite.json using command `cp appwrite.json_sample appwrite.json`. Update variables in appwrite.json file as follows:

```
"variables": {
  "ZOOM_CLIENT_ID": "YOUR_CLIENT_ID",
  "ZOOM_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
  "APPWRITE_ENDPOINT": "https://cloud.appwrite.io/v1",
  "APPWRITE_API_KEY": "YOUR_APPWRITE_KEY"
}
```

Deploy collections/functions by executing `$appwrite deploy collection` & `$appwrite deploy function` commands sequentially in CLI.

## Setting Up Reminders for Team Chat:

Navigate to /client directory & install dependencies using NPM via commands `cd ./client` & `npm install`. Update .env_sample file as .env with credentials from your Zoom & AppWrite applications using command `cp .env_sample .env`.

Your updated .env file should look like this:
```
# /reminders/client/.env
# Credentials from your Team Chat App
ZOOM_SECRET_TOKEN = ''
BOT_JID = ''
APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'
APPWRITE_PROJECT = ''
APPWRITE_API_KEY = ''
```

Now start ngrok instance (`ngrok https 4000`) & run application locally (`npm run dev`). Grab secure https URL from ngrok output & add it in Bot endpoint URL [development] field of Reminders Team Chat App followed by \command set up earlier.

Also update redirect for OAuth URL under 'App Credentials Tab' in Reminders Team Chat App settings.

## Authorizing Application:
Go to Local Test tab of your Reminders Team Chat app settings & generate Testable URL by clicking on “Generate”. Paste this URL in browser which will redirect you to authorize app in your environment thus adding application to your Zoom client enabling its usage.

For example:
/remindme to drink water in 3 minutes

Wait for reminder time duration & receive reminder notification in your client!
