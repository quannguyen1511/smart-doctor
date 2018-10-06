var fs = require("fs");
var db = require("./db");
var model = require("./models/disease.model");

model.find({}, {_id:0}).exec((err, diseases)=>{
    if(err) throw new Error(err);
    else{
      var temp = JSON.stringify(diseases);
      fs.writeFile(__dirname + "/data.json", temp, 'utf8');
    }
  });