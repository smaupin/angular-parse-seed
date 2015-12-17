/*
 * SERVER.JS
 */

 require('dotenv').load();
 process.env.NODE_ENV = process.env.NODE_ENV || 'development';

 var express = require('express')
 , app = express()
 , path = require('path')
 , bodyParser = require('body-parser')
 , flash = require('connect-flash')
 , cors = require('cors')
 , logger = require('morgan')
 , mongoose  = require('mongoose')
 , request = require('request-promise');

// mongoose.connect(config.db);

app.use("/", express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(logger('dev'));
app.use(flash());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var ejs = require('ejs');
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html');

// // RESOURCES
// app.get('/', resources.index);
// app.get('/templates/:name', resources.templates);
// require('./resources/users')(app);

// // redirect all others to the index (HTML5 history)
// app.get('*', resources.index);

// module.exports = server;

// for the sentiment analysis api to work

// function tweetsToDatum (tweets) {
//   var analyzedTweets = [];
//   count = 0;
//   tweets.forEach(function(t, index) {
//     var cleanedText = t.replace(/[^\w\s]/gi, '');
//     var APIKEY = process.env.APIKEY;
//     var url = 'http://api.datumbox.com/1.0/TwitterSentimentAnalysis.json?api_key=' + APIKEY + '&text=' + cleanedText;
    
//     request.post(url, cleanedText)
//     .then(function(body) {
//       analyzedTweets.push(body);
//       // console.log("response is ", response);
//       console.log("body is ", body);      
//       console.log("index is ", index);      
//       console.log("analyzedTweets = ", analyzedTweets.length);
//       count++;
//     }, function(err) {
//       console.log("there was an error");
//       console.log(analyzedTweets);
//       count++;
//     });

//     console.log("Count is" + count);

//   });
//   if (count === 100) {
//     console.log("Worked");
//     return analyzedTweets;
//   }
// }

app.post('/api/analyze', function(req, res) {



  // function tweetsToDatum (tweets) {
  var sentimentJSON = {neg: 0, pos: 0, neu: 0};
  var analyzedTweets = [];
  req.body.forEach(function(t, index) {
    var cleanedText = t.replace(/[^\w\s]/gi, '');
    var APIKEY = process.env.APIKEY;
    var url = 'http://api.datumbox.com/1.0/TwitterSentimentAnalysis.json?api_key=' + APIKEY + '&text=' + cleanedText;
    
    request.post(url, cleanedText)
    .then(function(body) {
      console.log("body is", body);
      // {"output":{"status":1,"result":"negative"}}
      if (body['output']['result'] === "negative") {
        sentimentJSON.neg ++;
      } else if (body['output']['result'] === "positive") {
        sentimentJSON.pos ++;
      } else if (body['output']['result'] === "neutral") {
        sentimentJSON.neu ++;
      }

      console.log(sentimentJSON);

      analyzedTweets.push(body);
      // console.log("response is ", response);
      console.log("body is ", body);      
      console.log("index is ", index);      
      console.log("analyzedTweets = ", analyzedTweets.length);
    }, function(err) {
      console.log("there was an error");
      console.log(analyzedTweets);
    });

  });

    // console.log("Count is" + count);
  setTimeout(function() {
    console.log("three seconds later");
    res.json(analyzedTweets);
  }, 3000);
  // if (count === 100) {
  //   console.log("Worked");
  //   // return analyzedTweets;
  //   res.json(analyzedTweets);
  // }
  // console.log(req);
  // console.log(req.body);
  // var analysis = tweetsToDatum(req.body);
  // console.log('analysis is', analysis);
  // res.json(analysis);
  // console.log("post call is working");
});

app.listen(3000);
console.log('server running at http://localhost:' + 3000);