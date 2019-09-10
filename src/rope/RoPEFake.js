import Compiler from '../programming/Compiler'
import { Command, CommandTypes } from '../programming/Command'

export default class RoPE
{
    constructor()
    {
        this.onConnectedCallbacks = []
        this.onConnectionFailedCallbacks = []
        this.onMessageCallbacks = []
        this.compiler = new Compiler()
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

    sendCommands(commands)
    {
        const characteristic = this.compiler.compile(commands)
        console.log(characteristic)
    }

    clear()
    {
    }

    async execute()
    {
        const executeCommand = Command.create(CommandTypes.Execute)
        await this.sendCommands([executeCommand])
    }
}