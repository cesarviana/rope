export default class RoPE
{
    constructor()
    {
        this.onConnectedCallbacks = []
        this.onConnectionFailedCallbacks = []
        this.onMessageCallbacks = []
    }
    
    search()
    {
        const random = Math.random() * 7 + 3
        setTimeout(_=>
        {
            const connected = Math.random() > 0.5;
            if (connected)
            {
                this._notify(this.onConnectedCallbacks)
            }
            else 
            {
               this._notify(this.onConnectionFailedCallbacks)
            }
        }, random)
    }

    _notify(callbackArray)
    {
        callbackArray.forEach(callback=>{
            callback.call(this)
        })
    }

    onConnected(callback)
    {
        this.onConnectedCallbacks.push(callback)
    }

    onConnectionFailed(callback)
    {
        this.onConnectionFailedCallbacks.push(callback)
    }

    onMessage(callback)
    {
        this.onMessageCallbacks.push(callback)
    }

    sendInstructions(instructions)
    {
        console.log(instructions)
    }

    clear()
    {
    }

    execute()
    {
        console.log('RoPE: Execute')
    }
}