export default class RoPE
{
    constructor()
    {
        this.onConnectedCallbacks = []
        this.onConnectionFailedCallbacks = []
    }
    
    search()
    {
        const random = Math.random() * 7 + 3
        setTimeout(_=>
        {
            const connected = Math.random() > 0.5;
            if (connected)
            {
                this.notify(this.onConnectedCallbacks)
            }
            else 
            {
               this.notify(this.onConnectionFailedCallbacks)
            }
        }, random)
    }

    notify(callbackArray)
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

}