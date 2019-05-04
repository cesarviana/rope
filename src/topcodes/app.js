import RoPE from '../rope/RoPE'
import Camera from './Camera'

const EXECUTE_CHAR = 'e';
const CLEAR_CHAR   = 'c';

class App {
    constructor() 
    {
        this.codes = 
        {
            205: 'f',
            279: 'b',
            157: 'l',
            327: 'r',
            31: 'e'
        }
        this.setupEventListeners();
    }
    
    setupEventListeners()
    {
        let elements = document.getElementsByClassName('command-button')
        for(let i=0; i<elements.length;i++)
        {
            elements[i].addEventListener('click', event =>
            {
                this.rope.sendInstructions(event.target.id);
            })
        }
    }
    
    async start()
    {
        App.log('starting..');
        this.rope = new RoPE();
        await this.rope.search();
        this.rope.onMessage(message=>{
            App.log('RoPE - "' + message + '"');
        })
        
        this.camera = new Camera(TopCodes,'video-canvas');
        this.camera.startStop();
        
        this.camera.onChangeCodes(async (topcodes) => await this.onChangeCodes(topcodes));
    }

    async onChangeCodes(topcodes)
    {
        const instructions = topcodes
                        .sort((a,b)=> a.x > b.x ? 1 : -1)
                        .map(topcode => this.codes[topcode.code] || '')
                        .reduce((a,b)=>a + b,'');
        
        const instructionsWithoutExecute = instructions.replace(EXECUTE_CHAR,'');
        
        if(instructions.includes('e'))
        {
            try 
            {
                const finalInstruction = CLEAR_CHAR + instructionsWithoutExecute + EXECUTE_CHAR;
                App.log(finalInstruction);
                await this.rope.sendInstructions( finalInstruction );
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