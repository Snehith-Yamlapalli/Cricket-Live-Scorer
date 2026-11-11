# Cricket Live Scorer

The local-match scorer is organised by feature instead of keeping match rules in a screen component.

```
src/features/match/
  components/        shared match UI
  pages/             setup, lineup, scorer, substitutions, result, scorecard
  services/
    scoringEngine.js pure cricket scoring and transition rules
    matchFactory.js  creates the persisted match model
    matchRepository.js Firebase Realtime Database boundary
```

New matches use the Firebase path `matches/{matchId}`. Every ball is calculated by `scoringEngine` and then persisted as one match snapshot. This means refreshing, opening the scorecard, changing a bowler at an over boundary, replacing a dismissed batter, changing innings, and live rendering all use the same source of truth.

Run locally with:

```bash
npm start
```

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [https://cricket-live-scorer-beta.vercel.app/](https://cric-live-scorer.vercel.app/Base) to view it in your browser.\
### Just Register & then Sign in with any Fake/MadeUp mail to Enter OR click the Google SignIn option.

## To check the LiveScore 
Open https://cricket-live-scorer-beta.vercel.app/livescore/FirstBattingTeamNamevsSecondBattingTeamName  (Edit the Team Names)
