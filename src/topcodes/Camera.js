export default class Camera
{
    constructor(TopCodes, videoId)
    {
        this.TopCodes = TopCodes;
        this.videoId = videoId;
        this.topcodes = [];
        
        this.codeChangesCountArray = [];
        this.codeChangesLimit = 3;
        
        this.changeOnTopcodesNumberLimit = 3;
        this.changeOnTopcodesNumber = 0;
        
        this.onChangeCodesCallback = function(){}
    }
    
    startStop()
    {
        this.TopCodes.startStopVideoScan(this.videoId);
    }
    
    onChangeCodes(callback)
    {
        this.onChangeCodesCallback = callback;
        this.TopCodes.setVideoFrameCallback(this.videoId, jsonString => {
            const json = JSON.parse(jsonString);
            if(this._topcodesChanged(json.topcodes))
            {
                this.topcodes = json.topcodes;
                
                this.codeChangesCountArray = [];
                this.changeOnTopcodesNumber = 0;

                this.onChangeCodesCallback(this.topcodes);
            }
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
                if(this.topcodes[i].code !== newTopcodes[i].code)
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