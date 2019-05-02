/**
 * RoPE.
 * He can be programmed!
 */

class RoPE {

    constructor(){
        this.bluetooth = new Bluetooth();
        this.bluetooth.on('characteristic-changed', this._handleBluetoothMessage)
        this.instructions = [];
    }

    async search() {
        await this.bluetooth.search();
    }

    onConnected(callback){
        this.bluetooth.on('connected', callback);
    }

    onConnectionFailed(callback){
        this.bluetooth.on('connection-failed', callback);
    }

    execute(){
        this.sendInstructions('e')
    }

    clear(){
        this.bluetooth.setCharacteristic('c')
    }

    onMessage(callback) {
        // this.bluetooth.on('characteristic-changed', callback)
    }

    async sendInstructions(instructionsString) 
    {
        alert(instructionsString);
        this.instructions.push(instructionsString)
        this._startCommunication()
    }

    async _startCommunication() 
    {
        if(!this.bluetooth.isConnected())
        {
            await this.bluetooth.search(
            {
                serviceUuid: '0000ffe0-0000-1000-8000-00805f9b34fb',
                characteristicUuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
                name: "-['.']- RoPE"
            })
        }
        this.bluetooth.setCharacteristic('Hi!')
    }

    _handleBluetoothMessage(characteristic) {
        if(characteristic === 'Command Accept')
        {
            this.bluetooth.setCharacteristic(this.instructions.pop())
        }
    }

}