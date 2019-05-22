/**
 * RoPE.
 * He can be programmed!
 */
import Bluetooth from "../bluetooth/Bluetooth";

export default class RoPE {

    constructor()
    {
        this.bluetooth = new Bluetooth();
    }

    async search() 
    {
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
        await this.sendInstructions('e')
    }

    async clear()
    {
        await this.sendInstructions('c')
    }

    onMessage(callback) 
    {
        this.bluetooth.on('characteristic-changed', callback)
    }

    async sendInstructions(instructionsString) 
    {
        this.bluetooth.setCharacteristic('cmds:'+instructionsString)
    }
}