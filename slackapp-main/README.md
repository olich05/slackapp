# Slack Daily Partner Bot

A Node.js bot that automatically posts daily thread messages for a list of partner organizations to a Slack channel. It runs on a schedule via GitHub Actions and also exposes an HTTP server with manual trigger endpoints and a Slack slash command. Hosts on rendin. 

## What It Does

Every day at 3:30 AM UTC, the bot posts a message for each team to a configured Slack channel, then posts each team's partners as thread replies. Each partner thread includes the current date (DD.MM format).

**Teams and partners:**

| Team | Partners |
|---|---|
| D1 | Stake, Soft2Bet, Cheddr, Mahadev, SBOBet |
| D2 | Onyxcrown, UFA, Touchvas, Sportsbull, Betafric, Mossbets, 9ubet, Stakemate, Hakibets |
| D3 | RWB2, RWB1, V33-1, Song88 |

## Features

- **Automated daily posting** via GitHub Actions cron schedule
- **Manual trigger** via `GET /test` HTTP endpoint
- **Slack slash command** `/daily` — post threads on demand from within Slack
- **Health check** endpoint at `GET /ping` for uptime monitoring

## Tech Stack

- Node.js + Express 5
- [@slack/web-api](https://slack.dev/node-slack-sdk/web-api)
- GitHub Actions for scheduling

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

| Variable | Description |
|---|---|
| `SLACK_BOT_TOKEN` | OAuth token for your Slack bot (`xoxb-...`) |
| `CHANNEL_ID` | ID of the Slack channel to post into |
| `PORT` | Server port (optional, defaults to `3000`) |

Create a `.env` file locally or set these as secrets in your GitHub repository.

### 3. Slack app requirements

Your Slack app needs the following bot token scope:
- `chat:write` — to post messages to the channel

Make sure the bot is invited to the target channel.

### 4. Run the server

```bash
npm start
```

### 5. (Optional) Set up the `/daily` slash command

In your Slack app settings, create a slash command `/daily` pointing to:

```
https://<your-deployment-url>/slack/commands
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Basic server status |
| `GET` | `/ping` | Health check — returns `Server is awake ✅` |
| `GET` | `/test` | Manually trigger partner thread posting |
| `POST` | `/slack/commands` | Handles the `/daily` slash command |

## Automated Scheduling

The GitHub Actions workflow at [.github/workflows/daily-slack.yml](.github/workflows/daily-slack.yml) runs every day at **3:30 AM UTC**. It can also be triggered manually from the GitHub Actions UI.

Required GitHub secrets:
- `SLACK_BOT_TOKEN`
- `CHANNEL_ID`

## Project Structure

```
slackapp-main/
├── server.js                      # Express server + Slack bot logic
├── test.js                        # Local simulation (no Slack required)
├── package.json
├── .github/
│   └── workflows/
│       └── daily-slack.yml        # Scheduled GitHub Actions workflow
└── .gitignore
```
