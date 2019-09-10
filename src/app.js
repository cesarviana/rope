import RoPE from './rope/RoPE'
import BlocksView from './view/BlocksView' 
import { Command, CommandTypes, Commands } from './programming/Command'
import $ from 'jquery'

class App {
    
    constructor()
    {
        this.rope = new RoPE()
        this.blocks = new BlocksView()
        this.setupUiEventListeners()
        this.setRoPEEventListeners()
        this.setBlocksEventListeners()
        this.sounds = 
        {
            start: new Audio(this.asset('startsound.wav')),
            stop: new Audio(this.asset('stopsound.wav')),
            error: new Audio(this.asset('error.flac')),
            next: new Audio(this.asset('next.wav'))
        }
        this.blockGoClicked = false
    }

    // event listeners
    setupUiEventListeners()
    {
        $('#magnifying-button').click(_=> {
            this.startSearch()
        })
        $('#rope-connection').on('click', _ => {
            if ($('#rope-connection').hasClass('disconnected')) {
                this.startSearch()
            }
        })
        $('#go-block').on('mouseup', () => {
            this.onGoClick()
        })
    
    }

    onGoClick()
    {
        if(this.blockGoClicked) 
        {
            return
        }
        this.rope.execute()
        this.blockGoClicked = true
        $('#go-block').addClass('disabled')
        setTimeout(_=>{
            this.blockGoClicked = false
            $('#go-block').removeClass('disabled')
        }, 1000)
    }

    setRoPEEventListeners()
    {
        this.rope.onConnected(_=>
        {
            this.hideMagnifying()
            this.showProgrammingView()
            this.showConnected()
            clearInterval('changeSleepingImage')
            this.resetProgramming()
            this.pointPieceToExecute()
        })
        this.rope.onConnectionFailed(_=>
        {
            this.hideMagnifying()
            this.showSleepingRoPE()
            this.showDisconnected()
            this.showConnectionView()
        })
        this.rope.onMessage(this.handleMessage)
    }

    setBlocksEventListeners()
    {
        this.blocks.on('changed', pieces => 
        {
            this.onPiecesChanged(pieces)
        })
        this.blocks.on('click', index => 
        {
            if (this.debug && this.started) {
                const notClickedOnNextIndex = this.executedIndex + 1 != index
                if (notClickedOnNextIndex) {
                    this.sounds.error.play()
                } else {
                    this.sounds.next.play()
                    // TODO this.rope.executeNextInstruction()
                }
            }
        })
    }

    // change ui
    
    showMagnifying()
    {
        $('#magnifying').show('fast')
    }

    hideMagnifying()
    {
        $('#magnifying').hide('slow')
    }

    showSleepingRoPE()
    {
        setInterval(_=>
        {
            this.changeSleepingImage()
        }, 2000)
    }

    changeSleepingImage()
    {
        if( $('#rope').attr('src') ==  this.asset('rope_not_found.svg')) 
        {
            $('#rope').attr('src', this.asset('rope_not_found_2.svg'))
        }
        else 
        {
            $('#rope').attr('src', this.asset('rope_not_found.svg'))
        }
    }

    showProgrammingView() 
    {
        $('#connecting-view').hide(400, () => $('#programming-view').show())   
    }

    showConnectionView()
    {
        if ($('#connecting-view').is(':visible'))
            return
        $('#programming-view').hide(400, () => $('#connecting-view').show())
    }

    resetProgrammingView()
    {
        this.hideShadow()
        this.blocks.removeSnappedPieces()
        this.blocks.enableDragging()
    }

    hideShadow()
    {
        this.blocks.hideHighlight()
        $('#shadow').fadeOut(1000, 'linear')
    }

    showConnected()
    {
        $('#rope-connection').addClass('connected').removeClass('disconnected')
    }

    showDisconnected()
    {
        $('#rope-connection').addClass('disconnected').removeClass('connected')
    }

    showDebugging(show) 
    {
        if(show){
            $('#debug-button').addClass('active')
            $('#placeholders-area').addClass('debug')
        } else {
            $('#debug-button').removeClass('active')
            $('#placeholders-area').removeClass('debug')
        }
    }

    pointPieceToExecute()
    {
        if (this.debug && this.started) 
        {
            this.blocks.pointToIndex(this.executedIndex + 1)
        } 
        else 
        {
            this.blocks.hidePointer()
        }
    }

    showShadow()
    {
        this.sounds.start.play()
        if (!$('#shadow').length) {
            $('<div id="shadow"></div>').css({
                width: '100%',
                height: '100vh',
                opacity: '0.5',
                background: 'gray',
                position: 'fixed',
                'z-index': '3',
                display: 'none'
            }).prependTo($('#programming-view'))
        }

        $('#shadow').fadeIn(400, 'linear')
        this.blocks.highlightSnapped()
    }

    // dealing with the model
    
    startSearch()
    {
        this.rope.search()
        this.showMagnifying()
    }

    resetProgramming()
    {
        this.rope.clear()
        this.debug = false
        this.showDebugging(this.debug)
        this.resetProgrammingView()
    }

    piecesToCommands(pieces)
    {
        const commands = []
        pieces.forEach(piece => {
            const parameter = piece.$elm.attr('data-command')
            const command = Command.create(CommandTypes.Keypad, parameter)
            commands.push(command)
        })
        return commands
    }

    async onPiecesChanged(pieces) 
    {
        const commands = this.piecesToCommands(pieces)
        
        if(commands.length >= 1){
            commands.unshift(Commands.BuzzerOff)
        }

        commands.unshift(Commands.Clear)

        if(commands.length > 2){
            commands.splice(commands.length - 1, 0, Commands.BuzzerOn)
        }
        
        this.rope.sendCommands(commands)
    }

    // util
    asset(file)
    {
        return 'assets/' + file
    }

    registerServiceWorker() 
    {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('service-worker.js').then(_ => {
                    console.log('Service Worker Registered')
                })
        }
    }

    addTestBlocks()
    {
        const commands = [];
        for(let i=0; i<3; i++) 
        {
            commands.push('FORWARD');
            commands.push('BACKWARD');
            commands.push('LEFT');
            commands.push('RIGHT');
        }
        this.blocks.setCommands(commands);
    }

}

const app = new App()
app.registerServiceWorker()