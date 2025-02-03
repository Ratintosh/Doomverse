const { exec } = require("child_process");

exports.generateCommand = function (data, gameID) {
    bin = data[gameID].game.sourceport
    iwad = data[gameID].game.iwad
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
