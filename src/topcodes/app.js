import RoPE from '../rope/RoPE'
import Camera from './Camera'
import Program from './Program'

class App
{
    constructor() 
    {
        this.codes = 
        {
            205: 'f',
            279: 'b',
            157: 'l',
            327: 'r',
            31: 'e'
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
        this.rope = new RoPE();
        await this.rope.search();
        this.rope.onMessage(message =>
        {
            App.log('RoPE - "' + message + '"');
        });
        
        this.camera = new Camera(TopCodes,'video-canvas');
        this.camera.startStop();
        
        this.camera.onChangeCodes(async (topcodes) => await this.onChangeCodes(topcodes));
    }

    async onChangeCodes(topcodes)
    {
        const instructionsString = topcodes
                        .sort((a,b)=> a.x > b.x ? 1 : -1)
                        .map(topcode => this.codes[topcode.code] || '')
                        .reduce((a,b)=>a + b,'');

        const program = new Program(instructionsString);

        if(program.mustExecute())
        {
            try 
            {
                const build = program.build();
                App.log(build);
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

let startButton = document.getElementById('startButton');
startButton.addEventListener('click', async () => {
    const app = new App();
    try {
        await app.start();
    } catch (e) {
        console.log(e);
    }
});