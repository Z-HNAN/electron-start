// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// could run in browser

const { contextBridge, ipcRenderer } = require('electron');

// JSBridge
class JSBridge {
  private callbackIdSeed = 0;
  private callbackMap: { [id: string]: (res: any) => void } = {};
  private eventMap: { [eventname: string]: [(res: any) => void] } = {};

  constructor() {
    // 监听端上消息
    ipcRenderer.on('native2Web', (channel, args) => {
      const { event = '', callbackId = '', res } = args;

      // callback
      if (typeof this.callbackMap[callbackId] === 'function') {
        this.callbackMap[callbackId](res);
        return;
      }

      // event
      if (Array.isArray(this.eventMap[event])) {
        this.eventMap[event].forEach(callback => typeof callback === 'function' && callback(res));
        return;
      }

    })
  }

  call(func: string, param: any): Promise<any> {
    const callbackId = `CB_${this.callbackIdSeed++}`
    return new Promise(resolve => {
      ipcRenderer.send('web2Native', { func, param, callbackId });
      this.callbackMap[callbackId] = (res: any) => {
        resolve(res);
        delete this.callbackMap[callbackId];
      }
    });
  }

  on(eventname: string, callback: (res: any) => void) {
    if (!this.eventMap[eventname]) {
      this.eventMap[eventname] = [] as any
    }

    this.eventMap[eventname].push(callback);
  }

  off(eventname: string, callback?: (res: any) => void) {
    if (callback) {
      const removeIdx = this.eventMap[eventname]?.indexOf(callback);
      if (removeIdx >= 0) {
        this.eventMap[eventname].splice(removeIdx, 1);
      } 
    } else {
      this.eventMap[eventname] = [] as any;
    }
  }

  exposePublic() {
    return {
      call: this.call.bind(this),
      on: this.on.bind(this),
      off: this.off.bind(this),
    }
  }
}

contextBridge.exposeInMainWorld('JSBridge', new JSBridge().exposePublic())
