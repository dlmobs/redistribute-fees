const https = require('https'); // or 'http' for http:// URLs
const fs = require('fs');
const allAddresses = require('../data/addresses.json')

const tryDownload = async(url, chain) => {
    // pull data
    var filename = `data/csv/${chain}-tokenholders.csv`
    if (chain == "boba") {
        var filename = `data/csv/${chain}-tokenholders.json`
    }
    const file = fs.createWriteStream(filename);
    const request = https.get(url, function(response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log(`download completed for chain ${chain}`);
        });
    });
}

const downloadCSVfiles = async () => {
    for (const chainID of Object.keys(allAddresses)) {
        const contract = allAddresses[chainID].tokens.unidx.address

        // url
        var url = `https://api.covalenthq.com/v1/${chainID}/tokens/${contract}/token_holders/?key=ckey_eee48ec4e2384aa6b20f84c065e&format=csv`
        
        // boba
        if (chainID == "288") {
            var url = `https://blockexplorer.boba.network/api?module=token&action=getTokenHolders&contractaddress=${contract}`
        }

        // chain name
        switch (chainID) {
            case "1":
                chain = "eth"
                break
            case "250":
                chain = "ftm"
                break
            case "288":
                chain = "boba"
                break
        }
        
        const download = await tryDownload(url, chain)
    }
};

module.exports = {
    downloadCSVfiles
}
