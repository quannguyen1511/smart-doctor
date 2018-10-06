const elasticsearch = require("elasticsearch");
var fs = require("fs");
var db = require("./db");
var model = require("./models/disease.model");
const client = new elasticsearch.Client({
        // hosts: ['localhost:9200']
        hosts: ["https://site:275c5e120960e83bd2b613cf4e2fa995@ori-eu-west-1.searchly.com"]
});

client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.error("elasticsearch cluster is down!");
    } else {
      console.log("Everything is ok");
    }
  }
);


client.indices.create(
  {
    index: "disease"
  },
  function(error, response, status) {
    if (error) {
      console.log(error);
    } else {
      console.log("created new index", response);
      var bulk = [];
      var diseases = require("./data.json");
      diseases.forEach(disease => {
        bulk.push({
          index: {
            _index: "disease",
            _type: "disease_list"
          }
        });
        bulk.push(disease);
      });
      client.bulk({ body: bulk }, function(err, response) {
        if (err) {
          console.log("Failed Bulk operation", err);
        } else {
          console.log("Successfully imported ", bulk.length);
        }
      });
    }
  }
);



// var cities = require("./cities.json")
// cities.forEach(city => {
//   bulk.push({
//     index: {
//       _index: "abcd",
//       _type: "disease_list"
//     }
//   });
//   bulk.push(city);
// });

// var diseases = require("./exdata.json");
// diseases.forEach(disease => {
//   bulk.push({
//     index: {
//       _index: "disease",
//       _type: "disease_list"
//     }
//   });
//   bulk.push(disease);
// });


//   client.bulk({ body: bulk }, function(err, response) {
//     if (err) {
//       console.log("Failed Bulk operation", err);
//     } else {
//       console.log("Successfully imported ", bulk.length);
//     }
//   });
