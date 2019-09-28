/**
 *Convert topcodes data to a rope program.
 */
export default class Compiler 
{
    constructor()
    {
        this.CLEAR_CHAR   = 'c';
        this.DISABLE_SOUND_CHAR = 's'
        this.ENABLE_SOUND_CHAR = 'S'
        this.codes = 
        {
            327: 'f',
            279: 'b',
            157: 'l',
            205: 'r',
            31:  'e'
        };       
    }
    
    compile(topcodes)
    {
        let instructionsString = topcodes.sort((a,b) => 
        { 
            if( Math.abs(a.y - b.y) < 20 ) // same line
            {
                return a.x - b.x
            } 
            else // different lines
            {
                return a.y - b.y
            }
        })
        .map(topcode => this.codes[topcode.code] || '')
        .reduce((strA,strB) => strA + strB, '');
        
        const result = /(?<commands>\w+[^e])(?<execute>e)?/.exec(instructionsString)
        
        if(!result)
        {
            return this.CLEAR_CHAR + instructionsString;
        }

        const commands = result.groups.commands
        const firstCommands = commands.substring(0, commands.length - 1)
        const lastCommand = commands[commands.length - 1]

        return  this.CLEAR_CHAR + 
                this.DISABLE_SOUND_CHAR +
                (firstCommands || '') +
                this.ENABLE_SOUND_CHAR +
                (lastCommand || '')
        
    }
    
    
}