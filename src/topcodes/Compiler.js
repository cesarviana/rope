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
            205: 'f',
            279: 'b',
            157: 'l',
            327: 'r',
            31:  'e'
        };       
    }
    
    compile(topcodes)
    {
        const instructionsString = topcodes.sort((a,b)=>{
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
            return this.CLEAR_CHAR + this.instructionsWithoutExecute + this.EXECUTE_CHAR;   
        } 
        
        return this.CLEAR_CHAR + instructionsString;
    }
    
    
}