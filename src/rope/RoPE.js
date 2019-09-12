import Compiler from '../programming/Compiler'
import { Command, CommandTypes } from '../programming/Command'
/**
 * RoPE.
 * He can be programmed!
 */
import Bluetooth from "../bluetooth/Bluetooth";

export default class RoPE {

    constructor()
    {
        this.bluetooth = new Bluetooth();
        this.compiler = new Compiler();
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

    onConnected(callback)
    {
        this.bluetooth.on('connected', callback);
    }

    onConnectionFailed(callback)
    {
        this.bluetooth.on('connection-failed', callback);
    }

    async execute()
    {
        const executeCommand = Command.create(CommandTypes.Execute)
        await this.sendCommands([executeCommand])
    }

    async clear()
    {
        const clearCommand = Command.create(CommandTypes.Clear)
        await this.sendCommands(clearCommand)
    }

    onMessage(callback) 
    {
        this.bluetooth.on('characteristic-changed', callback)
    }

    async sendCommands(commands) 
    {
        const characteristic = this.compiler.compile(commands)
        this.bluetooth.setCharacteristic(characteristic)
    }

}