const express = require("express");
const bodyParser = require("body-parser");
const { WebClient } = require("@slack/web-api");
const cron = require("node-cron");
const app = express();
const PORT = process.env.PORT;
const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);
const CHANNEL_ID = process.env.CHANNEL_ID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const partners = [
  "Stake", "Soft2Bet", "Cheddr", "Mahadev", "SBOBet",
  "Onyxcrown", "UFA", "Touchvas", "Sportsbull", "Betafric", "Mossbets", "9ubet", "Stakemate", "Hakibets",
  "RWB2", "RWB1", "V33-1", "Song88",
];

function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

async function sendPartnerThreads() {
  try {
    console.log("Starting partner threads...");
    const date = getCurrentDate();
    for (const partner of partners) {
      await web.chat.postMessage({
        channel: CHANNEL_ID,
        text: `${partner} (${date})`,
      });
      console.log(`Posted ${partner}`);
    }
    console.log("All partner threads sent successfully.");
  } catch (error) {
    console.error("Error sending partner threads:", error);
  }
}

// Manual test
app.get("/test", async (req, res) => {
  await sendPartnerThreads();
  res.send("Manual threads sent.");
});

// Slash command
app.post("/slack/commands", (req, res) => {
  const { command } = req.body;
  console.log("Slash command received:", req.body);
  if (command === "/daily") {
    res.send("Daily threads triggered! ✅");
    sendPartnerThreads();
    return;
  }
  res.status(200).send();
});

cron.schedule("10 7 * * *", sendPartnerThreads, {
  timezone: "Europe/Tallinn",
});

app.listen(PORT);
