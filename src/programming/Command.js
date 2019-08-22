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
        return `${this.commandType}${separator}${parametersString}`
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

module.exports = {
    Command, CommandTypes
}