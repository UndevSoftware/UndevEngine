const { Framework } = require('../framework/Framework.js');
const fs = require('fs');

const FRWK = new Framework('dev');
const SRVR = new FRWK.Server('192.168.1.102', 3000);

SRVR.Set('key', fs.readFileSync('./demo/certs/selfsigned.key'));
SRVR.Set('cert', fs.readFileSync('./demo/certs/selfsigned.crt'));

SRVR.Instantiate();

SRVR.Get('/', (request, response) => {
    response.write('<b>Tested</d>');

    response.end();
});

SRVR.Listen();