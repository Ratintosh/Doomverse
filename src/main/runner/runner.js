const { exec } = require("child_process");
const { getConfig } = require("../config/config");

exports.generateCommand = function (data, gameID) {
    cfg = getConfig();
    spName = data[gameID].game.sourceport
    bin = cfg["sourceports"][spName][0]
    if(bin.endsWith(".app")){
        bin = bin + "/Contents/MacOS/" + spName
    }

    iwadName = data[gameID].game["-iwad"]
    iwad = cfg["iwads"][iwadName][0]
    
    mods = ""
    if(data[gameID].game.modded){
        for(modfile in data[gameID].game.mods){
            mods = mods + " -file " + data[gameID].game.mods[modfile]
        }
    }
    cmd = `${bin} -iwad ${iwad} ${mods}`
    return cmd;

}

exports.runCommand = function(cmd) {
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
