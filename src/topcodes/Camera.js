import StartButton from './StartButton'

export default class Camera
{
    constructor(TopCodes, canvasId)
    {
        this.startButton = new StartButton();

        this.TopCodes = TopCodes;
        this.canvasId = canvasId;
        this.topcodes = [];
        
        this.codeChangesCountArray = [];
        this.codeChangesLimit = 1;
        
        this.changeOnTopcodesNumberLimit = 1;
        this.changeOnTopcodesNumber = 0;
        
        this.onChangeCodesCallback = function(){}
    }
    
    start()
    {
        if(this.started)
            return
        this.TopCodes.startStopVideoScan(this.canvasId);
        this.started = true;
    }
    
    onChangeCodes(callback)
    {
        this.onChangeCodesCallback = callback;
        this.TopCodes.setVideoFrameCallback(this.canvasId, jsonString => {
            const topcodes = JSON.parse(jsonString).topcodes;

            this._drawPositions(topcodes)

            if(this._topcodesChanged(topcodes))
            {
                this._drawPositions(topcodes, 'red')

                this.topcodes = topcodes.map(topcode=> {
                    return {
                        code: topcode.code,
                        angle: this._absoluteAngle(topcode.angle)
                    }
                });

                this.codeChangesCountArray = [];
                this.changeOnTopcodesNumber = 0;

                this.onChangeCodesCallback([...topcodes]);
            }
        })
    }
    
    _drawPositions(topcodes, textColor)
    {
        const canvas = document.getElementById(this.canvasId);
        const ctx = canvas.getContext('2d');
        ctx.font = "20px Arial";
        ctx.fillStyle = textColor || "yellow";
        topcodes.forEach(topcode=>
        {
            ctx.fillText(`angle:${topcode.angle}`,   topcode.x, topcode.y-20);
            ctx.fillText(`radius:${topcode.radius}`, topcode.x, topcode.y);
            ctx.fillText(`x:${topcode.x}`,           topcode.x, topcode.y+20);
            ctx.fillText(`y:${topcode.y}`,           topcode.x, topcode.y+40);
        })
    }
    
    /**
     * Checks if topcodes views by camera has changed.
     * The image changes frequently, but at mean the information the same.
     * For example. A fiducial mark coded as 327, by instant movement light variations
     * can be read as other code. 
     * @param {Array} newTopcodes 
     */
    _topcodesChanged(newTopcodes)
    {
        if(this.topcodes.length === newTopcodes.length ){

            let codeChanges = 0;

            for(let i=0; i < this.topcodes.length; i++)
            {
                const savedTopcode = this.topcodes[i]
                const newTopcode = newTopcodes[i]

                const savedCode = savedTopcode.code
                const newCode = newTopcode.code
                const changedCode = savedCode !== newCode
                
                if(changedCode)
                {
                    codeChanges++
                }
            }

            return codeChanges > this.codeChangesLimit || this.starRotated(newTopcodes)
        } 
        return true
        
    }

    _absoluteAngle(angle){
        return (angle + 2).toFixed(2)
    }

    starRotated(topcodes)
    {
        return this.startButton.isPressed(topcodes)
    }
}