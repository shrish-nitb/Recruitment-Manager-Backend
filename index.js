//RECRUITMENT-MANAGER-API
const {db} = require("./initFirestore.cjs");
const express = require("express");

const app = express();

// For parsing application/json
app.use(express.json());

const data = {}

app.get('/create', async (req, res) => {
    var response = 0;
    const data =  req.query;
    console.log(data);
    //data validation

    //All fields present
    if(data.name != null && data.scholar != null && data.branch != null && data.email != null && data.section != null && data.primary != null && data.secondary != null && data.whatsapp != null){
        var lengthCheck = true;
        //Character limit less than 60
        Array.from(data).forEach((i)=>{
            if(data[i].toString.length()>60)
                lengthCheck = false;
        })
        if(lengthCheck){
            //whatsapp legitimacy check
            var regExp = /[a-zA-Z]/g;
            if(data.whatsapp.toString().length == 10 && !regExp.test(data.whatsapp)){
                //duplicacy validation
                var query = db.collection('users').where("whatsapp", "==", data.whatsapp);
                var result = await query.get();

                if(result.empty){
                    //fresh entry create_user
                    await db.collection('users').doc().set(data);
                    response = 2;
                } else {
                    //Whatsapp number already used
                    response = 3;
                }
            } else {
                //Either the number not have 10 digits or special chars present
                response = 11;
            }
        } else {
            //Field character size exceeded keep response shorter
            response = 12;
        }
    } else {
        //Data missing form was tampered
        response = 13;
    }

    res.send(response.toString());
});

app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});

