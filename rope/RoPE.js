/**
 * RoPE.
 * He can be programmed!
 */

class RoPE {

    constructor(){
        this.bluetooth = bluetooth; // change to new Bluetooth()
        this.bluetooth.on('characteristic-changed', this._handleBluetoothMessage)
        this.instructions = [];
    }

    search() {
        this.bluetooth.search();
    }

    onConnected(callback){
        this.bluetooth.on('connected', callback);
    }

    onConnectionFailed(callback){
        this.bluetooth.on('connection-failed', callback);
    }

    execute(){
        this.bluetooth.setCharacteristic('e');
    }

    clear(){
        this.bluetooth.setCharacteristic('c')
    }

    onMessage(callback) {
        // this.bluetooth.on('characteristic-changed', callback)
    }

    sendInstructions(instructionsString) {
        this.instructions.push(instructionsString)
        this._startCommunication()
    }

    _startCommunication() {
        this.bluetooth.setCharacteristic('Hi!')
    }

    _handleBluetoothMessage(characteristic) {
        console.log(characteristic)
        if(characteristic === 'Command Accept'){
            this.bluetooth.setCharacteristic(this.instructions.pop())
        }
    }

}