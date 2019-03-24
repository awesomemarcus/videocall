// const configuration = {
//   iceServers: [{ url: 'stun:stun2.1.google.com:19302'}]
// };

// const connection = new RTCPeerConnection(configuration);

// connection.addStream(localStream);

// connection.onaddstream = event => {
    
// }

// connection.onicecandidate = event => {
//     if (event.candidate) {
//         sendMessage({
//           type: 'candidate',
//           candidate: event.candidate,
//         });
//     }
// }
import EventEmitter from 'eventemitter3';
import MediaConnection from './mediaconnection';

export default class Peer extends EventEmitter {
  constructor(host) {
    super();
    this._host = host;
    this._initializeServerConnect();
  }

  get socket() {
      return this._ws;
  }

  call(stream) {
    this._localStream = stream;
  }

  send(message) {
    return this.socket.send(message);
  }

  _initializeServerConnect() {
    this._ws = new WebSocket(this._host);

    this.socket.onopen = message => console.log('connected to signaling server');
    
    this.socket.onmessage = message => {
      console.log('got message on client', message.data);
      const data = JSON.parse(message.data);

      switch (data.type) {
          case 'media':
              this.emit('media', data);

              this._getMediaConnection();
              break;
      
          default:
              break;
      }
    };

    this.socket.onerror = err => console.log(err);
  }

  _getMediaConnection() {
    const connection = new MediaConnection(this._localStream);
    connection.on('stream',() => {});
    connection.on('candidate',() => {});
    connection.on('offer', () => {})
  }

}