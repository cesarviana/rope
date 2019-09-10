class Command
{
    static create(commandType, parameters)
    {
        return new Command(commandType, parameters)
    }

    constructor(commandType, parameters)
    {
        this.commandType = commandType;
        this.parameters = parameters;
    }

    toString()
    {
        const parametersString = this.getParametersString()
        const separator = parametersString ? ': ' : ''
        // return `${this.commandType}${separator}${parametersString}`
        if(!separator)
        {
            return this.commandType.toLowerCase()[0]
        } else 
        {
            if(this.commandType === CommandTypes.Keypad)
            {
                return parametersString.toLowerCase()[0]
            } else {
                return parametersString[0]
            }
        }
    }

    getParametersString() {
        if(Array.isArray(this.parameters))
        {
            return this.parameters.reduce((a, b) => `${a},${b}`);
        }
        return this.parameters
    }
}

const CommandTypes = 
{
    Clear: 'CLEAR',
    Execute: 'EXECUTE',
    Keypad: 'KEYPAD',
    Buzzer: 'BUZZER'
}

const Commands = {
    Clear: Command.create(CommandTypes.Clear),
    BuzzerOn: Command.create(CommandTypes.BuzzerOn, 'S'),
    BuzzerOff: Command.create(CommandTypes.BuzzerOn, 's'),
    Execute: Command.create(CommandTypes.Clear)
}

module.exports = {
    Command, CommandTypes, Commands
}