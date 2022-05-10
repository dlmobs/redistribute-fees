// "C:/Users/donia/Projects/HelloWorld.py"

// const spawn = require("child_process").spawn;
// const pythonProcess = spawn('python',["C:/Users/donia/Projects/HelloWorld.py"]);

// const fetch = require('cross-fetch')

// const APIKEY = 'ckey_eee48ec4e2384aa6b20f84c065e';
// const baseURL = 'https://api.covalenthq.com/v1'
// const fantomChainId = '250'
// const address = '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0'
// const url = new URL(`${baseURL}/${fantomChainId}/tokens/${address}/token_holders/?key=${APIKEY}&format=csv`);


// const stringurl = `${baseURL}/${fantomChainId}/tokens/${address}/token_holders/?key=${APIKEY}&format=csv`
// console.log(stringurl)

const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

const file = fs.createWriteStream("data/file.csv");
const request = https.get("https://api.covalenthq.com/v1/250/tokens/0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0/token_holders/?key=ckey_eee48ec4e2384aa6b20f84c065e&format=csv", function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
});

// async function getWalletBalance(chainId, address) {
//     const url = new URL(`${baseURL}/${chainId}/tokens/${address}/token_holders/?key=${APIKEY}&format=csv`);
//     console.log(url)
//     const response = await fetch(url);
//     const result = await response.json();
//     const data = result.data;
//     console.log(data)
//     return data;
// }

// // Example address request
// getWalletBalance(fantomChainId, demoAddress);