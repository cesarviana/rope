/**
 *Convert topcodes data to a rope program.
 */
export default class Compiler 
{
    constructor()
    {
        this.EXECUTE_CHAR = 'e';
        this.CLEAR_CHAR   = 'c';
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
        
        if(instructionsString.includes('e'))
        {
            const instructionsWithoutExecute = instructionsString.replace(this.EXECUTE_CHAR, '');
            return this.CLEAR_CHAR + instructionsWithoutExecute + this.EXECUTE_CHAR;
        } 
        
        return this.CLEAR_CHAR + instructionsString;
    }
    
    
}