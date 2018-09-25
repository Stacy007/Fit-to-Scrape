var express = require("express");
var mongojs = require("mongojs");

var cheerio = require("cheerio");
var request = require("request");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
    res.send("Articles");
  });

  app.get("/all", function(req, res) {
    db.scrapedData.find({}, function(error, found) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(found);
      }
    });
  });  

console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from reddit's webdev board:" +
            "\n***********************************\n");

app.get("/scrape", function(req, res) {            
request("https://old.reddit.com/r/webdev/", function(error, response, html) {

  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
//   var results = [];

  $("p.title").each(function(i, element) {

    var title = $(element).text();

    var link = $(element).children().attr("href");

    if (title && link) {
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(inserted);    
            }
        });
        }
    });
  });

  res.send("Scrape Complete");
  console.log(results);
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });