export default class RoPE {
  constructor() {
    this.onConnectedCallbacks = [];
    this.onConnectionFailedCallbacks = [];
    this.onMessageCallbacks = [];
  }

  async search() {
    const timeout = (Math.random() * 4 + 3) * 1000;
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        const connected = Math.random() > 0.5;
        if (connected) {
          resolve()
        } else {
          reject()
        }
      }, timeout)
    });
  }

  _notify(callbackArray, data) {
    callbackArray.forEach(callback => {
      callback.call(this, data)
    })
  }

  onConnected(callback) {
    this.onConnectedCallbacks.push(callback)
  }

  onConnectionFailed(callback) {
    this.onConnectionFailedCallbacks.push(callback)
  }

  onMessage(callback) {
    this.onMessageCallbacks.push(callback)
  }

  sendCommands(commands) {
    this.commands = commands;
    // const characteristic = this.compiler.compile(commands);
    // console.log(characteristic)
    console.log('sending commands', JSON.stringify(commands))
  }

  clear() {
  }

  async execute() {
    this.sendCommands(this.commands);

    this._notify(this.onMessageCallbacks, '<program:started>');

    this.commands.forEach((command, index) => {
      this._notify(this.onMessageCallbacks, `<executed:${index}>`)
    });

    setTimeout(() => {
      this._notify(this.onMessageCallbacks, `<program:terminated>`)
    }, 1000)
  }
}
