# Lockers MVP

This project is an MVP to automate lockers.
More specifically, this represents the API to use to control those lockers like open a locker remotely

# Usage

In order to run this project you just need to have ["docker compose"](https://docs.docker.com/compose/install/) installed on your machine and then run:

```sh
docker compose up --build api
```

# Contributing (Development)

In order to contribute to this project (or just run it locally), you will need to install dependencies and run dev command like:

```
pnpm i
pnpm run dev
```

# Configuration

This project has some configurations that can be set via environment variables:

- `PORT`: what is the port to listen for the API (required). Example: "3000"
- `HOST`: what is the interface to listen for the API (default is "0.0.0.0")
- `SLACK_CHANNEL_ID`: what is the channel ID to send Slack notifications (optional)
- `SLACK_TOKEN`: what is the [Slack APP token](https://api.slack.com/tutorials/tracks/getting-a-token) to use to send Slack notifications (optional)
- `DATABASE_URL`: URL string to connect with database

# FAQs

- Why are almost all imports dynamic?
  > From my experience troubleshooting JS projects, I saw many memory limitations regarding these projects.
  > Instead of load and keep module in memory, even if it's not in use, with this approach we try to only hold the module in memory while we are using it. If we don't need it, then garbage collector should be able to detect no reference, therefore clearing it.
