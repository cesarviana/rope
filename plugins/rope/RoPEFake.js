export default class RoPE {
  constructor() {
    this.onConnectedCallbacks = [];
    this.onConnectionFailedCallbacks = [];
    this.eventHandlers = {}
    this.connected = false
  }

  async search() {
    const timeout = (Math.random() * 2 + 3) * 100;
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        this.connected = Math.random() > 0.5;
        this.connected ? resolve() : reject()
      }, timeout)
    });
  }

  _notify(event, param) {
    this.eventHandlers[event].forEach((handler)=>{
      handler.call(this,param) 
    });
  }

  onConnected(callback) {
    this.onConnectedCallbacks.push(callback)
  }

  onConnectionFailed(callback) {
    this.onConnectionFailedCallbacks.push(callback)
  }

  isConnected() {
    return this.connected
  }

  _on(event, handler) {
    if (this.eventHandlers[event] === undefined) {
      this.eventHandlers[event] = []
    }
    this.eventHandlers[event].push(handler)
  }

  onExecutionStarted(handler, caller) {
    this._on('program', function(parameter) {
      if (parameter == 'started'){
        handler.call(caller)
      }
    })
  }

  onExecutionStopped(handler, caller) {
    this._on('program', function(parameter) {
      if (parameter == 'terminated'){
        handler.call(caller)
      }
    })
  }

  onExecutedInstruction(handler) {
    this._on('executed', handler)
  }

  onAddedInstruction(handler) {
    this._on('addi', function(parameter) {
      handler.call(this, parameter)
    })
  }

  sendCommands(commands) {
    this.commands = commands;
    console.log('sending commands', JSON.stringify(commands))
  }

  clear() {
  }

  async execute(commands) {
    this.sendCommands(commands);

    this._notify(`program`,`started`);

    const commandExecutionTime = 1000
    let timeout = 1000

    commands.forEach((_, index) => {
      setTimeout(() => {
        this._notify(`executed`,index);
      }, timeout += commandExecutionTime)
    });

    const terminatedTimeout = commandExecutionTime * (commands.length + 1)
    
    setTimeout(() => {
      this._notify(`program`,`terminated`);
    }, terminatedTimeout);
  }
}
