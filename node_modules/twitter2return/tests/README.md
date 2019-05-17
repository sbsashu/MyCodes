## Test Environment

To connect to Twiter, a `.env` file is required:

1. Create a `.env` file in the root directory
2. Use the template below to provide Twitter credentials inside the `.env` file

```
TWITTER_CONSUMER_KEY=***
TWITTER_CONSUMER_SECRET=***
TWITTER_ACCESS_TOKEN_KEY=***
TWITTER_ACCESS_TOKEN_SECRET=***
```

The [Tests](../README.md#tests) can then be run with the following command:

```
npm test
```
