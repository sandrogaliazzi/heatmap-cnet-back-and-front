import app from './src/app.js'
import fs from'fs';
import https from 'https'
import http from 'http';

const port = process.env.PORT || 5000;

var privateKey  = fs.readFileSync('src/key.pem', 'utf8');
var certificate = fs.readFileSync('src/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate,}; //usar no https

const server = http.createServer(credentials, app);

server.listen(port, () => {
  let now = new Date().toLocaleString("PT-br");
  console.log(`server starting on port: ${port} in: ${now}`)
});
