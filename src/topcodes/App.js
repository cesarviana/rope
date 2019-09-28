import StartButton from './StartButton'

export default class App
{
    constructor(camera, rope, compiler) 
    {
        this.compiler = compiler;
        this.camera = camera;
        this.rope = rope;
        this._setupEventListeners();
        this.executeTopCodeAngle = undefined;
        this.startButton = new StartButton();
    }
    
    _setupEventListeners()
    {
        this.camera.onChangeCodes(topcodes => 
            this.ifChangedParseAndSendInstructions(topcodes)
        );
        
        let elements = document.getElementsByClassName('command-button');
        for(let i=0; i<elements.length;i++)
        {
            elements[i].addEventListener('click', event =>
            {
                const commandAttribute = event.target.id;
                this.rope.sendInstructions(commandAttribute);
            })
        }

        this.rope.onConnected(()=>document.querySelector('button').style='display:none')
        this.rope.onConnectionFailed(()=>document.querySelector('button').style='display:block')
    }
    
    async start()
    { 
        this._tryConnectRoPE()
        this.camera.start();
    }

    async _tryConnectRoPE()
    {
        try
        {
            await this.rope.search();
            this.rope.onMessage(message =>
            {
                App.log('RoPE - "' + message + '"');
            });
        }
        catch (e)
        {
            App.log(e.message)
        }
    }

    async ifChangedParseAndSendInstructions(topcodes)
    {
        const instructions = this.compiler.compile(topcodes)
        App.log(instructions);
        
        if(this.startButton.isPressed(topcodes))
        {
            await this.rope.sendInstructions(instructions + 'e')    
        } 
        else if(instructions !== this.lastInstructions){
            this.lastInstructions = instructions
            await this.rope.sendInstructions(instructions)
        }
    }
   
    static log(text)
    {
        document.getElementById('status').innerHTML = text + '<br>'
    }
}