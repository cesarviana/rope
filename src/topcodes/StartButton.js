export default class StartButton 
{
    isPressed(topcodes)
    {
        const executeTopCode = topcodes.find(topcode => topcode.code === 31) // TODO
        
        if(!executeTopCode)
        {
            return false;
        }
        
        if(!this.angle) {
            this.angle = executeTopCode.angle
        }

        const angleDiff = Math.abs(executeTopCode.angle - this.angle);
        
        if( angleDiff > 1 )
        {
            this.angle = executeTopCode.angle;
            return true;
        }
        
        return false;
    }
    
}