var mongoose = require("mongoose");
var Schema = mongoose.Schema; //dinh nghia 1 kieu cau truc cho mongo

var diseaseSchema = new Schema({
  Id:{
    type: Number
  },
  LabelEn: {
    type: String
  },
  LabelVn: {
    type: String
  },
  symptom: {
    type: String
  },
  Iao:{
    type: String
  }
});
var disease = mongoose.model("disease", diseaseSchema);
module.exports = disease;
