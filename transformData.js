var db = require("./db");
var fs = require("fs"),
  xml2js = require("xml2js"),
  axios = require("axios").default;
var config = require("./config");
var diseaseController = require("./controllers/disease.controller");
var parser = new xml2js.Parser();
 fs.readFile(__dirname + "/data/HumanDO_v231.owl",async function(err, data) {
    console.log("Begin transform data");  
    await parser.parseString(data,async function(err, result) {
      await waitFor(10000);
      asyncForEach(result["rdf:RDF"]["owl:Class"],async element =>{
        await waitFor(100);
        var LabelEn = element["rdfs:label"][0]["_"];
        translate(LabelEn,async LabelVn =>{
          await waitFor(100);
          var symptonEn = element["obo:IAO_0000115"]?getSympton(element["obo:IAO_0000115"][0]["_"]):null;
          translate(symptonEn, async symptom =>{
            var Iao = element["obo:IAO_0000115"]?element["obo:IAO_0000115"][0]["_"]:null;
            var request = {LabelEn, LabelVn, symptom, Iao};
            await waitFor(100);
            diseaseController.createDisease(request).then(disease => console.log(disease)).catch(err => console.log(err));
          })
        })
      });
  });
  console.log("End of transform data");
});
  function getSympton(s){
    var array = s.split(" ");
        var kq = "";
    for(var i = 0; i < array.length - 1; i++){
        if(array[i] === "has_symptom"){
            for(var j = i + 1; j < array.length; j++){
                kq += " " + array[j];
                if (array[j+1] === "has_symptom"){
                    break;
                }
            }
        }
    }
    return kq.replace(/,/g,'');
}
async function translate(s,callback) {  
    var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + config.translate_key + "&text='" + s + "'&lang=en-vi";
  axios.get(url).then(async res =>{await waitFor(50); callback(res.data.text[0])});
  
}
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
