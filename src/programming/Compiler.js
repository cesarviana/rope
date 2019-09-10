export default class Compiler 
{
    compile(commands)
    {
        let program = 'cmds:';
        
        for(const command of commands)
        {
            const commandString = command.toString()
            if(commandString.indexOf(':') !== -1)
            {
                program += commandString.split(':')[1].trim().toLowerCase()[0]
            } 
            else
            {
                program += commandString.toLowerCase()[0]
            }
        }
        return program
    }
}