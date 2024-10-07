const logger = require('../SocksLog');

(async () => {
    // Setup with configurable variables
    logger.setup({ kvsId: 'ENTER_YOUR_ID', accessToken: 'ENTER_YOUR_ACCESS_TOKEN' });

    logger.log("This is a log");
    logger.info("This is an info");
    logger.warn("This is a warning");
    logger.error("This is an error");
})();