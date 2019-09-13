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

    _notify(callbackArray, data)
    {
        callbackArray.forEach(callback=>{
            callback.call(this, data)
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
        this.commands = commands
        const characteristic = this.compiler.compile(commands)
        console.log(characteristic)
    }

    clear()
    {
    }

    async execute()
    {
        this.sendCommands(this.commands)

        this._notify(this.onMessageCallbacks, '<program:started>')
        this.commands.filter(command=>command.commandType === CommandTypes.Keypad)
            .forEach((command, index)=>{
            this._notify(this.onMessageCallbacks, `<executed:${index}>`)
        })
        setTimeout(()=>{
            this._notify(this.onMessageCallbacks, `<program:terminated>`)
        }, 1000)
    }
}