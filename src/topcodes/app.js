/* global TopCodes */
import RoPE from '../rope/RoPE'
import Camera from './Camera'
import PWA from '../pwa/'
import Compiler from './Compiler'

class App
{
    constructor(camera, rope, compiler) 
    {
        this.compiler = compiler;
        this.camera = camera;
        this.rope = rope;
        this.setupEventListeners();
        this.executeTopCodeAngle = undefined;
    }
    
    setupEventListeners()
    {
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
        App.log('starting..');
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
        
        this.camera.onChangeCodes(topcodes => 
            this.ifChangedParseAndSendInstructions(topcodes)
        );
        this.camera.startStop();
        
    }

    async ifChangedParseAndSendInstructions(topcodes)
    {
        if(this.changedExecuteTopCodeAngle(topcodes))
        {
            await this.parseTopcodesAndSendInstructions(topcodes)            
        }
    }
    
    changedExecuteTopCodeAngle(topcodes)
    {
        const executeTopCode = topcodes.find(topcode => topcode.code === 31) // TODO
        
        if(!executeTopCode)
        {
            return false;
        }
        
        const executeTopCodeAngle = Math.abs(executeTopCode.angle)
        
        if(this.executeTopCodeAngle === undefined)
        {
            this.executeTopCodeAngle = executeTopCodeAngle;
            return false;
        }
        
        const angleDifference = Math.abs(executeTopCodeAngle - this.executeTopCodeAngle);
        
        if( angleDifference > 1 ) // TODO
        {
            this.executeTopCodeAngle = executeTopCodeAngle;
            return true;
        }
        
        return false;
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

const VIDEO_CANVAS_ID = 'video-canvas'
const camera = new Camera(TopCodes, VIDEO_CANVAS_ID);
const rope = new RoPE();
const compiler = new Compiler();
const app = new App(camera, rope, compiler);

let startButton = document.getElementById('startButton');
startButton.addEventListener('click', async (event) => 
{
    try 
    {
       await app.start();
    } 
    catch (e) 
    {
        console.log(e);
    }
});

const pwa = new PWA();
pwa.registerServiceWorker();

