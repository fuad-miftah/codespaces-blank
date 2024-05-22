import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Buffer as BufferPolyfill } from 'buffer';
//import { EventEmitter as EventEmitterPolyfill } from 'events';

declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill
//declare var EventEmitter: typeof EventEmitterPolyfill;
//globalThis.EventEmitter = EventEmitterPolyfill

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)
