class App {
    constructor() {
        this.codes = {
            205: 'f',
            279: 'b',
            157: 'l',
            327: 'r'
        }
    }
    start(){
        this.camera = new Camera(TopCodes,'video-canvas');
        this.camera.start();
        this.rope = new RoPE();
        this.camera.onChangeCodes(topcodes=> this.onChangeCodes(topcodes));
    }
    onChangeCodes(topcodes){
        const command = topcodes
                        .sort((a,b)=> a.x > b.x ? 1 : -1)
                        .map(topcode => this.codes[topcode.code]).reduce((a,b)=>a + b,'')
        console.log(command)
    }
}

const app = new App();
app.start();
