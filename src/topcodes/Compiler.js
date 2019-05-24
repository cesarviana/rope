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
        let instructionsString = topcodes.sort((a,b)=>{
            if(a.y > b.y)
            {
                if(a.x > b.x)
                {
                    return 1
                }
                return -1
            }
            else 
            {
                return -1    
            }
        })
        .map(topcode => this.codes[topcode.code] || '')
        .reduce((a,b)=>a + b,'');
        
        if(instructionsString.includes('e'))
        {
            const instructionsWithoutExecute = instructionsString.replace(this.EXECUTE_CHAR, '');
            return this.CLEAR_CHAR + instructionsWithoutExecute + this.EXECUTE_CHAR;
        } 
        
        return this.CLEAR_CHAR + instructionsString;
    }
    
    
}