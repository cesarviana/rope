export default class StartButton 
{
    
    constructor()
    {
        this.executeTopCodeChangeProperty = undefined;
        this.propertyName = 'angle'
        this.difference = 0.3
    }
    
    isPressed(topcodes)
    {
        const executeTopCode = topcodes.find(topcode => topcode.code === 31) // TODO
        
        if(!executeTopCode)
        {
            return false;
        }
        
        const executeTopCodeChangeProperty = Math.abs(executeTopCode[this.propertyName])
        
        if(this.executeTopCodeChangeProperty === undefined)
        {
            this.executeTopCodeChangeProperty = executeTopCodeChangeProperty;
            return false;
        }
        
        const difference = Math.abs(executeTopCodeChangeProperty - this.executeTopCodeChangeProperty);
        
        if( difference > this.difference )
        {
            this.executeTopCodeChangeProperty = executeTopCodeChangeProperty;
            return true;
        }
        
        return false;
    }
    
}