/* global TopCodes */
import RoPE from '../rope/RoPE'
import Camera from './Camera'
import Program from './Program'
import PWA from '../pwa/'

class App
{
    constructor(camera, rope) 
    {
        this.camera = camera;
        this.rope = rope;
        this.codes = 
        {
            205: 'f',
            279: 'b',
            157: 'l',
            327: 'r',
            31:  'e'
        };
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
        await this.rope.search();
        this.rope.onMessage(message =>
        {
            App.log('RoPE - "' + message + '"');
        });
        this.camera.onChangeCodes(async (topcodes) => await this.onChangeCodes(topcodes));
        this.camera.startStop();
    }

    async onChangeCodes(topcodes)
    {
        const instructionsString = topcodes
                        .sort((a,b)=> a.x > b.x ? 1 : -1)
                        .map(topcode => this.codes[topcode.code] || '')
                        .reduce((a,b)=>a + b,'');

        const program = new Program(instructionsString);

        if(instructionsString)
        {
            App.log(instructionsString);
        }

        if(program.mustExecute())
        {
            try 
            {
                const build = program.build();
                await this.rope.sendInstructions( build );
            } 
            catch (error) 
            {
                App.log('Error: ' + error)
            }
        }
    }

    static log(text)
    {
        document.getElementById('log').innerHTML += text + '<br>'
    }
}

const VIDEO_CANVAS_ID = 'video-canvas'
const camera = new Camera(TopCodes, VIDEO_CANVAS_ID);
const rope = new RoPE();

let startButton = document.getElementById('startButton');

startButton.addEventListener('click', async (event) => {
    const app = new App(camera, rope);
    
    const canvas = document.getElementById(VIDEO_CANVAS_ID);
    canvas.width = window.outerWidth * 1.8;
    canvas.height = window.outerHeight * 1.8;
    
    canvas.webkitRequestFullscreen()
    
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

