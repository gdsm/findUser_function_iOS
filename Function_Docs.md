Funtions are the serverless frameworks provided by google-firebase. I started using functions to make my applications scalable. 

Setup Problem: From the iOS application using the firebase SDK call a function to send email and phone to firebase. Inside the functions call firestore and get user from the UserList filtered with email&phone params.

PreRequisites: 
1. iOS application should be setup and firebase is configured in application.
2. Firebase account should be configured and some startup data should be there in firestore.

Here are some basic steps to start with functions.

1. Install node and npm on you system. Make sure that you have latest versions of node and npm. And your installation is on correct path ("/usr/bin/node").

2. Install firebase-tools.
$ sudo npm install -g firebase-tools

3. Login to firebase.
$ firebase login
This will switch to browser and ask for firebase login. Login to your firebase/gmail account and your firebase-cli will be activated with your credentials.

4. Some basic set of commands. Complete set of commands are avaliable on firebase github repo.
$ firebase projects:list   // list of projects.
$ firebase logout 
$ firebase init  // initialize a new functions in your current directory.

5. Run firebase init.
this will ask some questions related to firebase project. I used javascript as language and linked function to existing project. Installed npm dependencies. 
Command will create a default function in your current directory. Code for function is written inside index.js, firebase.json contains development and deployment configurations for firebase. 

6. Now your firebase project is created and open index.js file and write the following initialisation code:

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

This is the initialisation code for a function and firestore.

7. Below is my function code in JS, change the rool collection name of your own.:
exports.findUser = functions.https.onRequest((request, response) => {

    var db = admin.firestore();
    const reqData = request.body["data"];
    var email = reqData["email"];
    var phone = reqData["phone"];
    var findUsers = [];
    var data = {};
    data["status"] = false;

    db.collection(<FIRESTORE DB ROOT COLLECTION NAME>).doc("users").get().then(snapshot => {
        var usersList = snapshot.get("users_list");
        console.log("User list ", usersList);
        for (const i in usersList) {
            const user = usersList[i];
            console.log("traversing user ", user);
            if ((user["email_id"] == email) && (user["phone_num"] == phone)) {
                findUsers = findUsers.concat(user);
            }
        }
        if (findUsers.length > 0){
            data["users"] = findUsers;
            data["status"] = true;
        }
        var retVal = {};
        retVal["data"] = data;
        response.send(retVal);
    });

});

