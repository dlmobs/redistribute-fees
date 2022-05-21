const https = require('https'); // or 'http' for http:// URLs
const fs = require('fs');
const contracts = require('../data/addresses.json')

const downloadCSVfiles = async () => {
    for (const chainID of Object.keys(contracts)) {
        const contract = contracts[chainID].tokens.unidx.address
    
        const file = fs.createWriteStream(`data/tokenholders-${contract}.csv`);
        const request = https.get(`https://api.covalenthq.com/v1/${chainID}/tokens/${contract}/token_holders/?key=ckey_eee48ec4e2384aa6b20f84c065e&format=csv`, function(response) {
            response.pipe(file);
    
            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                console.log(`download completed for ${contracts[chainID].chain}`);
            });
        });
    }
};

module.exports = {
    downloadCSVfiles
}
