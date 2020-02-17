/**
 * RoPE.
 * He can be programmed!
 */
import Bluetooth from "./Bluetooth.js";

const BUSY = 1, SLEEPING = 0

export default class RoPE {

  constructor() {
    this.bluetooth = new Bluetooth();
    this.eventHandlers = {}
    this.bluetooth.on('characteristic-changed', (message) => { this._onBluetoothMessage(message) })
    this.state = SLEEPING
    this.onExecutionStopped(_=> this.state = SLEEPING )
  }

  async search() {
    await this.bluetooth.search(
      {
        serviceUuid: '0000ffe0-0000-1000-8000-00805f9b34fb',
        characteristicUuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
        name: "-['.']- RoPE"
      }
    );
  }

  onConnected(callback) {
    this.bluetooth.on('connected', callback);
  }

  onConnectionFailed(callback) {
    this.bluetooth.on('connection-failed', callback);
  }

  isConnected() {
    return this.bluetooth.isConnected()
  }

  async sendCommands(commands) {  
    if(this.state == BUSY){
      return
    }
    
    if(!commands || commands.length === 0) 
    {
      return this.clear()
    }

    const stringToSend = this._createCommandsString(commands)
    this._sendBluetoothMessage(stringToSend)
  }

  async execute(commands) {
    if(this.state == BUSY)
      return
    
    this.state = BUSY
    
    if(commands && commands.length > 0){
      const commandsCopy = [...commands]
      commandsCopy.push('execute')
      const stringToSend = this._createCommandsString(commandsCopy)
      await this._sendBluetoothMessage(stringToSend)
    } else {
      const stringToSend = this._createCommandsString(['execute'])
      await this._sendBluetoothMessage(stringToSend)
    }
  }

  async clear() {
    const stringToSend = this._createCommandsString(['clear'])
    await this._sendBluetoothMessage(stringToSend)
  }

  _on(event, handler) {
    if (this.eventHandlers[event] === undefined) {
      this.eventHandlers[event] = []
    }
    this.eventHandlers[event].push(handler)
  }

  onExecutionStarted(handler) {
    this._on('program', (parameter) => {
      if (parameter == 'started'){
        handler.call(this)
      }
    })
  }

  onExecutionStopped(handler) {
    this._on('program', (parameter) => {
      if (parameter == 'terminated'){
        handler.call(this)
      }
    })
  }

  onExecutedInstruction(handler) {
    this._on('executed', (parameter) => {
      handler.call(this, Number(parameter))
    })
  }

  onAddedInstruction(handler) {
    this._on('addi', (parameter) => {

      const dictionary = {
        f: 'forward',
        b: 'backward',
        l: 'left',
        r: 'right'
      }

      const addedCommand = dictionary[parameter]

      handler.call(this, addedCommand)
    })
  }

  _onBluetoothMessage(message) {
    const pattern = /(?<instruction>\w+):(?<parameter>\w+)/

    const match = message.match(pattern)

    if (!match) return

    const groups = match.groups
    const instruction = groups.instruction
    const parameter = groups.parameter

    if (this.eventHandlers[instruction]) {
      this.eventHandlers[instruction].forEach(eventHandler => {
        try {
          eventHandler.call(this, parameter) 
        } catch (error) {
          alert(error)
        }
      })
    }
  }

  _createCommandsString(commands) {
    const COMMANDS_PREFIX = 'cmds:';
    const SOUND_OFF = 's';
    const SOUND_ON = 'S';
    const CLEAR = 'c';
    const MESSAGE_FINALIZER = '\n'
    
    const firstCharOfEachCommand = commands.map(command => command[0]);
    const commandChars = firstCharOfEachCommand.reduce((a, b) => a + b, '');
    const firstCommandChars = commandChars.length > 1 ? commandChars.substring(0, commandChars.length - 1) : ''
    const lastCommandChar = commandChars[commandChars.length - 1]
    let stringToSend = COMMANDS_PREFIX + CLEAR + SOUND_OFF + firstCommandChars + SOUND_ON + lastCommandChar + MESSAGE_FINALIZER

    return stringToSend
  }

  async _sendBluetoothMessage(message) {
    this.bluetooth.setCharacteristic(message)
  }

}
