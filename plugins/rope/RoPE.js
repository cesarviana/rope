/**
 * RoPE.
 * He can be programmed!
 */
import Bluetooth from "./Bluetooth.js";

export default class RoPE {

  constructor() {
    this.bluetooth = new Bluetooth();
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
    await this.sendCommands('e')
  }

  async clear() {
    await this.sendCommands('c')
  }

  onMessage(callback) {
    this.bluetooth.on('characteristic-changed', callback)
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
