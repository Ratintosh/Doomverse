const SGDB = require('steamgriddb');
const client = new SGDB(''); //API Key
//Search:    https://www.steamgriddb.com/api/v2/search/autocomplete/{term}
async function searchSteamGridDB(gameTitle) {
    client.searchGame(gameTitle)
    .then((output) => {
        console.log(output);
        return games
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = {
    searchSteamGridDB
}