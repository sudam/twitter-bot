var Twitter = require("twitter");
var config = require("./config.js");
var fs = require("fs");

var client = new Twitter(config);
var params = { screen_name: "sudamnz", count: 10, lang: "en" };

getTweets(); // setInterval(getTweets, 25000);

function replyToTweets(tweeter, mentionId) {
  client.post(
    "statuses/update",
    {
      status: `Hey @${tweeter}, this is Sudam's so-called bot on behalf of him.`,
      in_reply_to_status_id: mentionId
    },
    (error, data, response) => {
      if (error) console.log(error);
    }
  );
}

function writeToFile(mentionId, tweeter) {
  fs.readFile("oldMentions.txt", function(err, buf) {
    if (!buf.includes(mentionId)) {
      var data = buf + "\n" + mentionId;

      replyToTweets(tweeter, mentionId);
      fs.writeFile("oldMentions.txt", data, err => {
        if (err) console.log(err);
        // console.log("Successfully Written to File: " + data);
      });
    } else {
      console.log("Waiting for Tweets...");
    }
  });
}

function getTweets() {
  client.get(
    "statuses/mentions_timeline",
    params,
    (error, mentions, response) => {
      if (!error) {
        for (const mention of mentions) {
          let tweeter = mention.user.screen_name;
          let mentionToLower = mention.text.toLowerCase();
          let mentionId = mention.id_str;

          if (mentionToLower.includes("hello")) {
            writeToFile(mentionId, tweeter);
          }
        }
      } else console.log(error);
    }
  );
}
