const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const http = require('https')

app.get("/", (rq, rs) => {
    require('https').get('https://dummyjson.com/users', (res) => {
        res.setEncoding('utf8');
        var body = "";
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            body = JSON.parse(body);
            const JsonData = {};
            body["users"].forEach(element => {
                if(JsonData[element["company"]["department"]] == null){
                    JsonData[element["company"]["department"]] = { "male": 0, 
                        "female": 0,                   
                        "ageRange": [0,0],           
                        "hair": {                      
                        },
                        "addressUser": {            
                        }
                    }
                }
                element["gender"] == "male" ? JsonData[element["company"]["department"]]["male"]++ : JsonData[element["company"]["department"]]["female"]++;

                if(JsonData[element["company"]["department"]]["hair"][element["hair"]["color"]] == null)
                    JsonData[element["company"]["department"]]["hair"][element["hair"]["color"]] = 0;
                
                JsonData[element["company"]["department"]]["hair"][element["hair"]["color"]]++;
                
                JsonData[element["company"]["department"]]["addressUser"][element["firstName"]+element["Lastname"]] = element["address"]["postalCode"]

                if(JsonData[element["company"]["department"]]["ageRange"][0] == 0 ){
                    JsonData[element["company"]["department"]]["ageRange"][0] = element["age"]
                }
                JsonData[element["company"]["department"]]["ageRange"][0] = JsonData[element["company"]["department"]]["ageRange"][0] >= element["age"] ? element["age"] : JsonData[element["company"]["department"]]["ageRange"][0];
                JsonData[element["company"]["department"]]["ageRange"][1] = JsonData[element["company"]["department"]]["ageRange"][1] <= element["age"] ? element["age"] : JsonData[element["company"]["department"]]["ageRange"][1];
            });
            for (const key in JsonData) {
                JsonData[key]["ageRange"] = JsonData[key]["ageRange"][0] + "-"+ JsonData[key]["ageRange"][1];
            }
            rs.send(JsonData);
        });
    });
 
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});