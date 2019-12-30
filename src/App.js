import React, { useState } from 'react';
import './App.css';
import { Howl } from 'howler';
import startSoundSrc from "./start-recording.mp3";
import stopSoundSrc from "./stop-recording.mp3";

import MediaRecorder from 'opus-media-recorder';

const startSound = new Howl({src: startSoundSrc});
const stopSound = new Howl({src: stopSoundSrc});

const workerOptions = {
  encoderWorkerFactory: function () {
    return new Worker(process.env.PUBLIC_URL + '/opus-media-recorder/encoderWorker.umd.js')
  },
  OggOpusEncoderWasmPath: process.env.PUBLIC_URL + '/opus-media-recorder/OggOpusEncoder.wasm',
  WebMOpusEncoderWasmPath: process.env.PUBLIC_URL + '/opus-media-recorder/WebMOpusEncoder.wasm',
};

export default () => {
  const [recordings, setRecordings] = useState([]);

  const rec = () => {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      const options = { mimeType: 'audio/ogg' };
      const recorder = new MediaRecorder(stream, options, workerOptions);
      recorder.addEventListener('dataavailable', e => {
        setRecordings(recordings.concat([{url: URL.createObjectURL(e.data)}]));
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      });
      recorder.start();
      startSound.once("end", () => {
        setTimeout(() => {
          recorder.stop();
          stopSound.play();
        }, 1000);
      });
      startSound.play();
    });
  };

  return (
    <div className="App">
      <button onClick={rec}>Recording 1 seconds</button>
      {recordings.map(recording => {
        return <div key={recording.url}><audio controls src={recording.url} /></div>
      })}
    </div>
  );
}

