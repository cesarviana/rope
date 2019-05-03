import RoPE from '../rope/RoPE'
import Camera from './Camera'

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
    }
    
    async start()
    {
        App.log('starting..');
        this.rope = new RoPE();
        await this.rope.search();

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
        const instructionsWithoutExecute = instructions.replace('e','');
        await this.rope.sendInstructions(instructionsWithoutExecute);
        App.log(instructions);
        if(instructions.includes('e'))
        {
            await this.rope.execute()
        }
    }

    static log(text)
    {
        document.getElementById('log').innerHTML += text
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