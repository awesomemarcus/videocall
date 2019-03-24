
const Websocket = require('ws');
const wss = new Websocket.Server({ port: 8080 });
const connections = {};

const sendTo = (ws, message) => {
    ws.send(JSON.stringify(message));
}

wss.on('connection', ws => {
    console.log('user connected')

    ws.on('message', message => {
        let data = null;
        try {
          data = JSON.parse(message);
        } catch (error) {
          console.log('Invalid JSON', error);
          data = {};
        }

        switch (data.type) {
            case 'media':
              if (connections[data.username]) {
                sendTo(ws, { type: 'media', success: false });
              } else {
                connections[data.username] = ws;
                ws.username = data.username;
                sendTo(ws, { type: 'media', success: true });
              }
                break;
            default:
                break;
        }
    });



    ws.on('close', () => {})
});
