import RoPE from '../rope/RoPE'
import Camera from './Camera'
import PWA from '../pwa/'
import Compiler from './Compiler'
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
        if(this.startButton.isPressed(topcodes))
        {
            await this.parseTopcodesAndSendInstructions(topcodes)            
        }
    }
    
    
    async parseTopcodesAndSendInstructions(topcodes)
    {
        const instructionsString = this.compiler.compile(topcodes)
        App.log(instructionsString);
        
        try 
        {
            App.log('Execute!' + instructionsString);
            await this.rope.sendInstructions( instructionsString );
        } 
        catch (error) 
        {
            App.log('Error: ' + error)
        }
    }

    static log(text)
    {
        console.log(text)
        document.getElementById('status').innerHTML = text + '<br>'
    }
}