/* global navigator TextEncoder TextDecoder $ */
export default class Bluetooth
{
    constructor()
    {
        this.eventHandlers = {};
        this.encoder = new TextEncoder('utf-8');
        this.decoder = new TextDecoder('utf-8');
        this.characteristic = undefined;
    }

    async search(options)
    {
        let serviceUuid = options.serviceUuid;
        let characteristicUuid = options.characteristicUuid;
        
        try 
        {
            this.device = await navigator.bluetooth.requestDevice({
                filters : [{
                    name: options.name
                }],
                optionalServices: [serviceUuid]
            });

            this.device.addEventListener('gattserverdisconnected', () => this._onDisconnected());
            let server = await this.device.gatt.connect();
            let service = await server.getPrimaryService(serviceUuid);
            this.characteristic = await service.getCharacteristic(characteristicUuid);
            this.characteristic.addEventListener('characteristicvaluechanged', (event) => this._characteristicChanged(event));
            this._notify('connected', this.characteristic);
        } 
        catch (error) 
        {
            this._notify('connection-failed', {});
            this._log('Argh! ' + error);
        }
    }

    _characteristicChanged(event) {
        const value = this.decoder.decode( event.target.value ).trim();
        this._log(`RoPE diz - ${value}` );
        this._notify('characteristic-changed', value)
    }

    _notify(event, result) {
        this.getEventHandlers(event).forEach(function(handler){
            handler.call(this,result)
        })
    }

    _onDisconnected() 
    {
        this.characteristic = undefined;
        this._notify('connection-failed')
    }

    setCharacteristic(value)
    {
        const chunks = value.match(/.{1,20}/g);
        chunks.forEach(chunk=>{
            this._log(`Tela diz - ${chunk}` );
            this.characteristic.writeValue(this.encoder.encode(chunk))
                .then(_ => {})
                .catch(error => {})    
        })
    }

    getEventHandlers(event) 
    {
        if (!this.eventHandlers[event])
            this.eventHandlers[event] = [];
        return this.eventHandlers[event]
    }

    on(event, handler) 
    {
        this.getEventHandlers(event).push(handler)
    }

    isConnected()
    {
        return this.characteristic !== undefined;
    }

    _log(text)
    {
        console.log(text);
    }
}
