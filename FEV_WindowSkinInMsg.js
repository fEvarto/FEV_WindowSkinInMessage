//=============================================================================
// FEV_WindowSkinInMsg.js
//=============================================================================

/*:
 * @plugindesc Extension for SRD_WindowSkinOption to support message frame IDs in Show Text command
 * @author: fEvarto
 * @help This plugin extends the functionality of SRD_WindowSkinOption to support
 * specifying message frame IDs in the Show Text command.
 * 
 * To activate the custom window skin, in the "Plugin command" and 
 * use the following command: showtext <WindowFrame: FrameName>.
 * 
 * To use default window skin in the message, the plugin command
 * should be showtext <WindowFrame: Classic>
 */
(function() {
    console.log('Window Skin In Message Plugin is loaded.');

    var nextWindowFrame = null;

    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);
    };

    Window_Message.prototype.updateWindowFrame = function() {
        var path;
        if (nextWindowFrame) {
            console.log('Updating window frame:', nextWindowFrame);
            path = 'img/SumRndmDde/window/' + nextWindowFrame;
        } else {
            // Загрузка текущей рамки из SRD_WindowSkinOption
            var index = ConfigManager.windowSkin;
            var frameName = SRD.WindowSkinOptions.names[index];
            if (frameName === "Classic") {
                path = 'img/system/Window';
            } else {
                path = 'img/SumRndmDde/window/' + frameName;
            }
        }
        console.log('Path to windowskin:', path);
        this.windowskin = ImageManager.loadBitmap('', path, 0, true);
        nextWindowFrame = null;
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'showtext') {
            this.processShowTextCommand(args);
        }
    };

    Game_Interpreter.prototype.processShowTextCommand = function(args) {
        var text = args.join(' ');
        if (text) {
            console.log('Parsing Show Text command parameters:', text);
            var match = text.match(/<WindowFrame: (.*)>/i);
            if (match) {
                var frameName = match[1];
                console.log('Setting window frame by name:', frameName);
                nextWindowFrame = frameName;
            }
        }
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        this.updateWindowFrame();
    };
})();
