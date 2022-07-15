

var path = require("path");
var when = require("when");
var pgutil = require('./pgutil');

process.env.NODE_RED_HOME = __dirname;

var settings = module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 10000000,

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:[ '66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js' ],

  
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',


    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: { },

    editorTheme: {
        projects: {
            // To enable the Projects feature, set this value to true
            enabled: true
        }
    },

    storageModule: require("./pgstorage"),

    httpNodeCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    },
    
    // Disbled Credential Secret
    credentialSecret: false
}

if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
    settings.adminAuth = {
        type: "credentials",
        users: function(username) {
            if (process.env.NODE_RED_USERNAME == username) {
                return when.resolve({username:username,permissions:"*"});
            } else {
                return when.resolve(null);
            }
        },
        authenticate: function(username, password) {
            if (process.env.NODE_RED_USERNAME == username &&
                process.env.NODE_RED_PASSWORD == password) {
                return when.resolve({username:username,permissions:"*"});
            } else {
                return when.resolve(null);
            }
        }
    }
}

settings.pgAppname = 'nodered';
pgutil.initPG();
pgutil.createTable();
