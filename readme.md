# SocksLog

SocksLog is a logging utility that allows you to log messages with different levels (INFO, WARN, ERROR) both locally and remotely.

## Features

- Log messages with different levels: INFO, WARN, ERROR
- Remote logging to a database
- Client for real-time log streaming

## Installation
```bash
npm install sockslog
```

Then create an account on https://kvs.wireway.ch and create a database and copy its ID from the URL and the access token using the button.


## Usage

### Logger Usage without remote
```js
const SocksLog = require('sockslog');

const logger = new SocksLog({
    noRemote: true
});

logger.info('Hello World');
```

### Logger Usage with remote
```js
const SocksLog = require('sockslog');

const logger = new SocksLog({
    accessToken: 'ENTER_YOUR_ACCESS_TOKEN',
    kvsId: 'ENTER_YOUR_ID'
});

logger.info('Hello World');
```

### Client/Viewer Usage
```js
const SocksLog = require('sockslog');

const logger = new SocksLog({
    accessToken: 'ENTER_YOUR_ACCESS_TOKEN',
    kvsId: 'ENTER_YOUR_ID'
});

logger.client()
```