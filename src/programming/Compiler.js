export default class Compiler 
{
    compile(commands)
    {
        let program = 'cmds:';
        
        for(const command of commands)
        {
            const commandString = command.toString()
            program += commandString
        }
        return program
    }
}