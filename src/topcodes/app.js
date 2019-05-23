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
            console.error(e)
        }
        
        this.camera.onChangeCodes(async (topcodes) => await this.onChangeCodes(topcodes));
        this.camera.startStop();
        
    }

    async onChangeCodes(topcodes)
    {
        const instructionsString = this.compiler.compile(topcodes)
        if(instructionsString.includes('e'))
        {
            try 
            {
                await this.rope.sendInstructions( instructionsString );
            } 
            catch (error) 
            {
                App.log('Error: ' + error)
            }
        }
    }

    static log(text)
    {
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

