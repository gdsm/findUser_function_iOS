const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.findUser = functions.https.onRequest((request, response) => {

    var db = admin.firestore();
    const reqData = request.body["data"];
    var email = reqData["email"];
    var phone = reqData["phone"];
    var findUsers = [];
    var data = {};
    data["status"] = false;

    db.collection("root_neural_chat").doc("users").get().then(snapshot => {
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