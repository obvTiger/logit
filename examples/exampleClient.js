const logger = require('../SocksLog');

(async () => {
    // Setup with configurable variables
    await logger.setup({ kvsId: 'ENTER_YOUR_ID', accessToken: 'ENTER_YOUR_ACCESS_TOKEN' });

    logger.client();
})();