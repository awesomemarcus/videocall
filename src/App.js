import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Peer from './peer';

class App extends Component {
  remoteRef = React.createRef();
  localRef = React.createRef();
  nameRef = React.createRef();
  peer = null;
  // ws = new WebSocket('ws://localhost:8080');

  componentDidMount() {
    this.peer = new Peer('ws://localhost:8080');
    this.peer.on('media', data => {
      console.log(data);
      this._getlocalStream();
    });
  }

  _getlocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: { minAspectRatio: 1.333, maxAspectRatio: 1.334 },
          optional: [
            { minFrameRate: 60 },
            { maxWidth: 640 },
            { maxHeigth: 480 }
          ]
        },
        audio: false,
      });
      this.localRef.current.srcObject = stream;
    } catch (error) {
      console.log(error);
    }
  }

  _sendMessage = message => {
    this.peer.send(JSON.stringify({
      type: 'media',
      username: this.nameRef.current.value,
    }));
  }

  render() {
    return (
      <div className="App">
        <div className="d-flex flex-column p-3">
          <div className="d-flex flex-row justify-content-center mb-3">
            <video ref={this.remoteRef} src="" id="remoteStream" className="mx-2" autoPlay>No stream</video>
            <video ref={this.localRef} src="" id="localStream" className="mx-2" autoPlay>No stream</video>
          </div>
          <div>
            <div className="mb-2">
          <input type="text" name="name" ref={this.nameRef}/>
            </div>
          <button href="#" className="btn btn-success" onClick={this._sendMessage}>Start</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
