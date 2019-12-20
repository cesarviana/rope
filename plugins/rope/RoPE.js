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
    let firstCharOfEachCommand = commands.map(command => command[0]);
    const stringToSend = firstCharOfEachCommand.reduce((a, b) => a + b, '');
    console.log('sending instructions...');
    this.bluetooth.setCharacteristic(stringToSend)
  }

}
