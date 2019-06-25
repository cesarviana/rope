/*global $ global rope navigator BlocksView */
$(function () {

    const app = {
        rope: new RoPE(),
        blocks: new BlocksView(),
        
        executedIndex: -1,
        commands : '',
        completedCommands : true
    }

    // Event listeners

    // $('#debug-button').on('click', () => {
    //     app.toggleDebug()
    // })

    // $('#go-block').on('mouseup', (e) => {
    //     if(app.blockGoClick) 
    //         return
        
    //     app.rope.execute()
    //     app.blockGoClick = true
    //     $('#go-block').addClass('disabled')
    //     setTimeout(_=>{
    //         app.blockGoClick = false
    //         $('#go-block').removeClass('disabled')
    //     }, 1000)
    // })

    // app.rope.onConnected(() => {
      //  app.showProgrammingView()
      //  app.setConnected(true)
      //  app.rope.clear();
      //  clearInterval('changeSleepingImage')
      //  app.resetProgrammingView()
      //  app.debug = false
      //  app.showDebugging(app.debug)
      //  app.pointPieceToExecute()
    // })

    // app.rope.onConnectionFailed(() => {
      //  app.showMagnifying(false)
      //  app.setConnected(false)
      //  app.showSleepingRoPE()
      //  app.showConnectionView()
    //})

    app.rope.onMessage(app.handleMessage)

    // app.blocks.on('changed', (pieces) => {
    //     app.setPiecesCharacteristic(pieces)
    // })

    // app.blocks.on('click', (index) => {
    //     // If debug is active and execution started, must listen clicks on
    //     // next piece
    //     if (app.debug && app.started) {
    //         const notClickedOnNextIndex = app.executedIndex + 1 != index
    //         if (notClickedOnNextIndex) {
    //             app.sounds.error.play()
    //         } else {
    //             app.sounds.next.play()
    //             // TODO
    //             // app.rope.executeNextInstruction()
    //         }
    //     }
    // })

    $(window).on('scroll', () => {
        app.adjustShadowWidth()
    })

    // Methods to update ui

    //app.showConnectionView = () => {
    //     if ($('#connecting-view').is(':visible'))
    //         return
    //     $('#programming-view').hide(400, () => $('#connecting-view').show())
    // }
   
    // app.showDebugging = (show) => {
    //     if(show){
    //         $('#debug-button').addClass('active')
    //         $('#placeholders-area').addClass('debug')
    //     } else {
    //         $('#debug-button').removeClass('active')
    //         $('#placeholders-area').removeClass('debug')
    //     }
    // }

    // app.showShadow = () => {
    //     app.sounds.start.play()
    //     if (!$('#shadow').length) {
    //         $('<div id="shadow"></div>').css({
    //             width: '100%',
    //             height: '100vh',
    //             opacity: '0.5',
    //             background: 'gray',
    //             position: 'fixed',
    //             'z-index': '3',
    //             display: 'none'
    //         }).prependTo($('#programming-view'))
    //     }

    //     $('#shadow').fadeIn(400, 'linear')
    //     app.blocks.highlightSnapped()
    // }

    app.showStopped = _ => {
        app.sounds.stop.play()
        app.hideShadow()
        app.blocks.removeSnappedPieces()
        app.blocks.removeRemainingPlaceholders()
        app.blocks.adjustAreaWidth()
        app.blocks.hidePointer()
    }

    // app.hideShadow = _ => {
    //     app.blocks.hideHighlight()
    //     $('#shadow').fadeOut(1000, 'linear')
    // }

    app.showAdded = (commands) => {
        app.blocks.setCommands(commands)
    }

    app.showStartedAction = ({ command, index }) => {
        app.blocks.highlight({ command, index })
    }

    app.pointPieceToExecute = () => {
        if (app.debug && app.started) {
            app.blocks.pointToIndex(app.executedIndex + 1)
        } else {
            app.blocks.hidePointer()
        }
    }

    app.adjustShadowWidth = () => {
        if ($('#shadow').length) {
            $('#shadow').width('100%')
        }
    }
    
    // app.resetProgrammingView = () =>{
    //     app.hideShadow()
    //     app.blocks.removeSnappedPieces()
    //     app.blocks.enableDragging()
    // }

    // Methods to dealing with the model

    // app.startSearch = () => {
    //     app.rope.search()
    //     app.showMagnifying(true)
    //     app.showConnectionView()
    // }

    // app.registerServiceWorker = () => {
    //     if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker
    //             .register('service-worker.js').then((reg) => {
    //                 console.log('Service Worker Registered')
    //             })
    //     }
    // }

    // app.setConnected = (connected) => {
    //     if (connected){
    //         // - $('#rope-connection').addClass('connected').removeClass('disconnected')
    //     } else {
    //         // - $('#rope-connection').addClass('disconnected').removeClass('connected')
    //     }
    // }

    app.handleMessage = (characteristic) => {
        
        if(characteristic.indexOf("debug") != -1) // debugging firmware
            return
        
        if(characteristic.indexOf('ini') == -1 &&
           characteristic.indexOf('fim') == -1 &&
           characteristic.indexOf('parou') == -1 &&
           characteristic.indexOf('d:0') == -1 && 
           characteristic.indexOf('d:1') == -1 &&
           characteristic.indexOf('<l>') == -1 
           ) { 
               
            if( characteristic.indexOf('<cmds') != -1 ) { // novos comandos
                app.commands = characteristic.split(':')[1]
            } else {
            
                if(characteristic.indexOf('>') == -1){  // ainda terá mais comandos
                    app.commands += characteristic   
                } else {                                // agora finalizou
                    app.commands += characteristic.substr(0, characteristic.length - 1)
                }
                
            }
            
            if(characteristic.indexOf('>') != -1 ) {
                const commands = app.translate( app.commands )
                app.blocks.setCommands( commands )
            }
            
        } else {
            const characteristicSplit = characteristic.split(':')
            const action = characteristicSplit[0]
            switch (action) {
                case '<iniciou>':
                    app.blocks.disableDragging()
                    app.showShadow()
                    app.started = true
                    app.pointPieceToExecute()
                    break
                case '<parou>': 
                    app.blocks.enableDragging()
                    app.executedIndex = -1
                    app.started = false
                    app.commands = ''
                    app.showStopped()
                    break
                case '<ini':
                    let index = characteristicSplit[1].slice(0,-1) // remove o ">"
                    app.executedIndex = new Number(index)
                    app.showStartedAction({ index })
                    break
                case '<fim>':
                    app.blocks.hideHighlight()
                    app.pointPieceToExecute()
                    break
                case '<d':
                    app.debug = characteristicSplit[1].slice(0,-1) == "1"
                    app.showDebugging(app.debug)
                    app.pointPieceToExecute()
                    break
                default:
                    break
            }
        }
    }

    app.translate = (commandsStr) => {
        const commands = []
        for (let i = 0; i < commandsStr.length; i++) {
            const char = commandsStr.charAt(i)
            commands.push(char)
        }
        return commands
    }

    app.toggleDebug = () => {
        // TODO
        //app.rope.setCharacteristic('<d:' + (app.debug ? 0 : 1) + '>')
    }

    // app.setPiecesCharacteristic = (pieces) => {
    //     let commands = ''
    //     pieces.forEach(piece => {
    //         commands += piece.$elm.attr('data-command')
    //     })
    //     app.rope.sendInstructions(commands)
    // }

    // Start

    // app.registerServiceWorker()

})