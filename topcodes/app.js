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
    
    start()
    {
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
        if(instructions.includes('e'))
        {
            this.rope.execute()
        }
    }
}

let startButton = document.getElementById('startButton');
startButton.addEventListener('click', async function(){
    const bluetooth = new Bluetooth();

    bluetooth.on('connected', async function()
    {
        alert('conectado');
        setInterval(async function(){
            await bluetooth.setCharacteristic('cmds:f');
            await bluetooth.setCharacteristic('cmds:e');
            alert('oi')
        }, 2000)
    })

    await bluetooth.search(
        {
            serviceUuid: '0000ffe0-0000-1000-8000-00805f9b34fb',
            characteristicUuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
            name: "-['.']- RoPE"
        }
    );
    
    
    // const rope = new RoPE();
    // rope.search();
    // const app = new App();
    // app.start();
});