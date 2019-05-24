export default class Camera
{
    constructor(TopCodes, canvasId)
    {
        this.TopCodes = TopCodes;
        this.canvasId = canvasId;
        this.topcodes = [];
        
        this.codeChangesCountArray = [];
        this.codeChangesLimit = 5;
        
        this.changeOnTopcodesNumberLimit = 5;
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
                this.topcodes = topcodes;
                
                this.codeChangesCountArray = [];
                this.changeOnTopcodesNumber = 0;

                this.onChangeCodesCallback(topcodes);
            }
        })
    }
    
    _drawPositions(topcodes)
    {
        const canvas = document.getElementById(this.canvasId);
        const ctx = canvas.getContext('2d');
        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        topcodes.forEach(topcode=>
        {
            ctx.fillText(`radius:${topcode.radius}`, topcode.x, topcode.y);
            ctx.fillText(`x:${topcode.x}`,           topcode.x, topcode.y+20);
            ctx.fillText(`y:${topcode.y}`,           topcode.x, topcode.y+40);
            ctx.fillText(`angle:${topcode.angle}`,   topcode.x, topcode.y+60);
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
        this._countNumberOfCodesChanged(newTopcodes);
        
        if(this._sameNumberOfCodes()){
            for(let i=0; i < this.topcodes.length; i++)
            {
                if(this.topcodes[i].code !== newTopcodes[i].code ||
                    this.topcodes[i].angle !== newTopcodes[i].angle
                )
                {
                    this._incrementCodeChange(i)
                }
                else
                {
                    this._decrementCodeChange(i)
                }
            }
        }
        
        return this.changeOnTopcodesNumber > this.changeOnTopcodesNumberLimit ||
               this.codeChangesCountArray.find(changesCount => changesCount > this.codeChangesLimit);
    }

    _countNumberOfCodesChanged(newTopcodes)
    {
        if(newTopcodes.length !== this.topcodes.length)
        {
            this.changeOnTopcodesNumber++;
        } 
        else 
        {
            this.changeOnTopcodesNumber = 0;
        }
    }

    _incrementCodeChange(i)
    {
        if(this.codeChangesCountArray[i] === undefined)
        {
            this.codeChangesCountArray[i] = 0;
        }
        this.codeChangesCountArray[i]++;
    }

    _decrementCodeChange(i)
    {
        if(this.codeChangesCountArray[i] > 0)
        {
            this.codeChangesCountArray[i]--;
        }
    }

    _sameNumberOfCodes()
    {
        return this.changeOnTopcodesNumber === 0;
    }
}