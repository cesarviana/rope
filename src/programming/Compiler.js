export default class Compiler 
{
    compile(commands)
    {
        let program = 'BEGIN>>>\n';
        
        for(const command of commands)
        {
            const commandString = command.toString()
            program += commandString + '\n'
        }
        
        program += '<<<END' + '\n'
        
        return program
    }
}