class App {
    constructor() {
        this.codes = {
            205: 'f',
            279: 'b',
            157: 'l',
            327: 'r',
            31: 'e'
        }
    }
    
    log(l){
        document.getElementById('log').innerHTML += l
    }

    start()
    {
        this.log('starting..');
        this.rope = new RoPE();
        this.rope.search();

        this.camera = new Camera(TopCodes,'video-canvas');
        this.camera.start();
        
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
        this.log(instructions)
        if(instructions.includes('e'))
        {
            this.rope.execute()
        }
    }
}

const app = new App();
let startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => app.start());