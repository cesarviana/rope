/**
 * RoPE.
 * He can be programmed!
 */
import Bluetooth from "./Bluetooth.js";

export default class RoPE {

  constructor() {
    this.bluetooth = new Bluetooth();
    this.eventHandlers = {}
    this.bluetooth.on('characteristic-changed', (message) => { this._onBluetoothMessage(message) })
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

  async execute() {
    await this.sendCommands(['execute'])
  }

  async clear() {
    await this.sendCommands(['clear'])
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
      console.log('addi', parameter)
      handler.call(this, parameter)
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
      this.eventHandlers[instruction].forEach(eventHandler => eventHandler.call(this, parameter))
    }

    // switch(instruction)
    // {
    //     case 'executed':
    //         const nextIndex = Number(parameter) + 1
    //         this.blocks.highlight({index: nextIndex})
    //         break;
    //     case 'program':
    //         if(parameter === 'started'){
    //             this.showShadow()
    //             this.blocks.highlight({index: 0})
    //         } else {
    //             this.hideShadow()
    //             this.blocks.hideHighlight()
    //             this.blocks.clear()
    //         }
    //         break;
    //     case 'addi':
    //         if(this.commands.length && parameter === this.commands[0])
    //         {
    //             this.commands.shift()
    //         } 
    //         else 
    //         {  
    //             console.log('adicionando')
    //             const commands = {
    //                 f:'FORWARD', b:'BACKWARD', r:'RIGHT', l:'LEFT'
    //             }
    //             const command = commands[parameter]
    //             this.blocks.addPieceFrom(command)
    //         }
    //     break;
    // }
  }

  async sendCommands(commands) {
    const COMMANDS_PREFIX = 'cmds:';
    const SOUND_OFF = 's';
    const SOUND_ON = 'S';

    const firstCharOfEachCommand = commands.map(command => command[0]);
    const commandChars = firstCharOfEachCommand.reduce((a, b) => a + b, '');
    const firsCommandChars = commandChars.length > 1 ? commandChars.substring(0, commandChars.length - 1) : ''
    const lastCommandChar = commandChars[commandChars.length - 1]
    const stringToSend = COMMANDS_PREFIX + SOUND_OFF + firsCommandChars + SOUND_ON + lastCommandChar
    console.log('sending instructions...', stringToSend);
    this.bluetooth.setCharacteristic(stringToSend)
  }

}
