//RECRUITMENT-MANAGER-API
const { db } = require("./initFirestore.cjs");
const express = require("express");
var validator = require("email-validator");

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://recruitment-2023.vercel.app"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// For parsing application/json
app.use(express.json({extended: true}))

const data = {};

app.post("/create", async (req, res) => {
  var response = 0;
  const data = req.body;
    // var data = {"name":"Shrish Shrivastava","scholar":"211119072","email":"shrish108@gmail.com","whatsapp":"9340399137","year":"Second","course":"Materials and Metallurgical Engineering","section":"","primary":"Web Developer","secondary":"Sponsorship Executive"};
  console.log(data);
  //data validation

  //All fields present
  if (
    data.name != null &&
    data.scholar != null &&
    data.course != null &&
    data.year != null &&
    data.email != null &&
    data.section != null &&
    data.primary != null &&
    data.secondary != null &&
    data.whatsapp != null
  ) {
    const collection = {
      course: [
        "Architecture",
        "Civil Engineering",
        "Chemical Engineering",
        "Computer Science Engineering",
        "Electrical Engineering",
        "Electronics and Communication Engineering",
        "Materials and Metallurgical Engineering",
        "Mathematics and Data Science",
        "Mechanical Engineering",
        "Planning",
      ],
      Year: ["First", "Second", "Third", "Fourth"],
      Section: [
        "Architecture A",
        "Architecture B",
        "Planning A",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
      ],
      Verticals: [
        "Sponsorship Executive",
        "Event Manager",
        "Content Writer",
        "Web Developer",
        "Designer",
        "Video Editor",
      ],
    };

    const coursePassed = collection.course.includes(data.course);
    const yearPassed = collection.Year.includes(data.year);
    const sectionPassed =
      data.year !== "First" || collection.Section.includes(data.section);
    const verticalsPassed =
      collection.Verticals.includes(data.primary) &&
      collection.Verticals.includes(data.secondary) &&
      data.primary !== data.secondary;
    const optionsPassed =
      coursePassed && yearPassed && sectionPassed && verticalsPassed;

    var lengthCheck = true;
    //Character limit less than 50
    Array.from(data).forEach((i) => {
      if (data[i].toString.length() > 50) lengthCheck = false;
    });
    if (lengthCheck) {
      if (optionsPassed) {
        const scholarPassed = /^\d+$/.test(data.scholar);
        const emailPassed = validator.validate(data.email);
        if (scholarPassed) {
          if (emailPassed) {
            //whatsapp legitimacy check
            //checks if string contains only numbers
            var regExp = /^\d+$/;
            if (
              data.whatsapp.toString().length == 10 &&
              regExp.test(data.whatsapp)
            ) {
              //duplicacy validation
              var query = db
                .collection("users")
                .where("whatsapp", "==", data.whatsapp);
              var result = await query.get();

              if (result.empty) {
                //fresh entry create_user
                await db.collection("users").doc().set(data);
                response = 2;
              } else {
                //Whatsapp number already used
                response = 3;
              }
            } else {
              //Whatsapp number invalid
              response = 11;
            }
          } else {
            //Email invalid
            reponse = 16;
          }
        } else {
          //Scholar number invalid
          response = 15;
        }
      } else {
        //Choice based responses are tampered
        response = 14;
      }
    } else {
      //Field character size exceeded keep response shorter
      response = 12;
    }
  } else {
    //Required data missing
    response = 13;
  }

  res.send(response.toString());
});

app.listen(3001, () => {
  console.log("Our express server is up on port 3001");
});
