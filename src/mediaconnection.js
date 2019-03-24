import { RTCPeerConnection } from "./adapter";
import EventEmitter from 'eventemitter3';

export default class MediaConnection extends EventEmitter {
    constructor(stream, config = {}) {
      super();
      this.connection = null;
      this._config = {
        iceServers: [{ url: 'stun:stun2.1.google.com:19302' }],
        ...config
      }

      this._localStream = stream;

      this._startConnection();
    }

    _startConnection() {
      this.connection = new RTCPeerConnection(this._config);

      this.connection.addStream(this._localStream);

      this.connection.onaddstream = event => {
        this.emit('stream', event.stream);
      }

      this.connection.onicecandidate = event => {
        if (event.candidate) {
          this.emit('candidate', event.candidate);
        }
      }

      this.connection.createOffer(this._createOffer, this._onCreateOfferError);

    }

    _createOffer(offer) {
      this.emit('offer', offer);
      this.connection.setLocalDesription(offer);
    }

    _onCreateOfferError(error) {
      console.log('create offer Error', error);
    }
}