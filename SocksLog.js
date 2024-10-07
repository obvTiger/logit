const axios = require('axios');
const WebSocket = require('ws');

class SocksLog {
    constructor() {
        this.config = {
            accessToken: null,
            databaseId: null,
            noRemote: false,
            logClient: false
        };
        this.axiosInstance = null;
    }

    /**
     * Set up the LogIt module with the given config.
     * The only supported config values are 'accessToken' and 'databaseId'.
     * @param {Object} config - The config values to set up the module with.
     */
    async setup(config) {
        this.config.noRemote = config.noRemote;

        if (!config.noRemote) {
            this.axiosInstance = axios.create({
                baseURL: 'https://kvs.wireway.ch/',
                headers: {
                    'Authorization': `${config.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            try {
                await this.axiosInstance.get(`database/all/${config.kvsId}`);
            } catch (error) {
                this.config.noRemote = true;
                this.log(`LogIt database invalid. Please sign up for an account at https://kvs.wireway.ch and provide your access token using .setup({ accessToken: 'your_access_token' })`, 'ERROR');
                process.exit(1);
            }
            this.config.accessToken = config.accessToken;
            this.config.kvsId = config.kvsId;
        }
    }


    client() {
        if (!this.config.accessToken || !this.config.kvsId || this.config.noRemote === false) {
            this.error('LogIt is not configured. Please call setup() with your access token and database ID.');
            return;
        }
        this.config.logClient = true


        const ws = new WebSocket(`wss://kvs.wireway.ch/events/${this.config.kvsId}?accessKey=${this.config.accessToken}`);

        const self = this;
        ws.on('open', function open() {
            
            self.log('Connection established.');
        });

        ws.on('message', function incoming(data) {
            const event = JSON.parse(data);


            if (event.type == "post") {
                const data = JSON.parse(event.value);
                const { message, level,  timeStamp} = data;

                if (level == "ERROR") {
                    console.log('\x1b[41m%s\x1b[0m', `ERROR\x1b[0m ${timeStamp}: ${message}`);
                } else if (level == "WARN") {
                    console.log('\x1b[43m%s\x1b[0m', `WARN\x1b[0m ${timeStamp}: ${message}`);
                } else if (level == "INFO") {
                    console.log('\x1b[44m%s\x1b[0m', `INFO\x1b[0m ${timeStamp}: ${message}`);
                }

            }
        });

        ws.on('error', function error(err) {
            self.error('Connection error:', err);
        });

        ws.on('close', function close() {
            self.log('Connection closed.');
        });
    }

    log(...args) {
        const message = args.join(' ');

        if ((!this.config.accessToken || !this.config.kvsId) && !this.config.noRemote) {
            console.error('LogIt is not configured. Please call setup() with your access token and database ID.');
            return;
        }

        const color = '\x1b[44m%s\x1b[0m'
        const timeStamp = new Date().toISOString();
        console.log(color, `INFO\x1b[0m ${timeStamp}: ${message}`);

        if (!this.config.noRemote && !this.config.logClient) {
            this.axiosInstance.post(`database/${this.config.kvsId}/${timeStamp}`, {
                value: JSON.stringify({ message, level: "INFO", timeStamp })
            });
        }
    }

    info(...args) {
        const message = args.join(' ');

        if ((!this.config.accessToken || !this.config.kvsId) && !this.config.noRemote) {
            console.error('LogIt is not configured. Please call setup() with your access token and database ID.');
            return;
        }

        const color = '\x1b[44m%s\x1b[0m'
        const timeStamp = new Date().toISOString();
        console.log(color, `INFO\x1b[0m ${timeStamp}: ${message}`);

        if (!this.config.noRemote && !this.config.logClient) {
            this.axiosInstance.post(`database/${this.config.kvsId}/${timeStamp}`, {
                value: JSON.stringify({ message, level: "INFO", timeStamp })
            });
        }
    }

    warn(...args) {
        const message = args.join(' ');

        if ((!this.config.accessToken || !this.config.kvsId) && !this.config.noRemote) {
            console.error('LogIt is not configured. Please call setup() with your access token and database ID.');
            return;
        }

        const color = '\x1b[43m%s\x1b[0m'
        const timeStamp = new Date().toISOString();
        console.log(color, `WARN\x1b[0m ${timeStamp}: ${message}`);

        if (!this.config.noRemote && !this.config.logClient) {
            this.axiosInstance.post(`database/${this.config.kvsId}/${timeStamp}`, {
                value: JSON.stringify({ message, level: "WARN", timeStamp })
            });
        }
    }
    error(...args) {
        const message = args.join(' ');

        if ((!this.config.accessToken || !this.config.kvsId) && !this.config.noRemote) {
            console.error('LogIt is not configured. Please call setup() with your access token and database ID.');
            return;
        }


        const color = '\x1b[41m%s\x1b[0m'
        const timeStamp = new Date().toISOString();
        console.log(color, `ERROR\x1b[0m ${timeStamp}: ${message}`);

        if (!this.config.noRemote && !this.config.logClient) {
            this.axiosInstance.post(`database/${this.config.kvsId}/${timeStamp}`, {
                value: JSON.stringify({ message, level: "ERROR", timeStamp })
            });
        }
    }
}

module.exports = new SocksLog();