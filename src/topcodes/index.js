/* global TopCodes */
import RoPE from '../rope/RoPE'
import Camera from './Camera'
import PWA from '../pwa/'
import Compiler from './Compiler'
import App from './App'

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