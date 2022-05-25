

// // Initialize the parser
// const parser = parse({delimiter: ','}, function (err, holders) {
//     console.log(holders)
// });

// Use the readable stream api to consume records
// fs.createReadStream("data/crosschain-tokenholders.csv").pipe(parser);

// console.log(parse(fs.createReadStream("data/crosschain-tokenholders.csv")))



/*
send usdc and ftm from treasury contract to wallet

treasury contract: 0x8e0dfafd247236b9025d3648f195386cad5b2da1
wallet address: 0x8c128f336B479b142429a5f351Af225457a987Fa
*/

require('dotenv').config();
const ethers = require('ethers');
const contractABI = require('../abis/treasury.json')
const erc20ABI = require('../abis/ERC20.json')
const allAddresses = require('../data/addresses.json')
const { availableFees } = require('./amountAvailable')

// all addresses needed
const usdcAddress = allAddresses[250].tokens.usdc.address
const ftmAddress = allAddresses[250].tokens.ftm.address
const addresses = [ftmAddress, usdcAddress]
const contractAddress = allAddresses[250].addresses.treasury.address

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

// wallet with write permissions, treasury, and usdc ethers objects (wallet is the address with access to write treasury contract)
const walletPK = new ethers.Wallet(process.env.TREASURY_PK, provider)
const contract = new ethers.Contract(contractAddress, contractABI, walletPK)
const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)

// wallet to receive funds
const recipient = allAddresses[250].addresses.feesRecipient.address

const collectFees = async (contract, addresses, recipient, provider) => {
    // amount of usdc and ftm available
    const sendingAmounts = [BigNumber(1000000), BigNumber(1000000000000000000)]

    // try transactions, sends usdc and ftm to recipient address
    for (const i in sendingAmounts) {
        const sendAmount = sendingAmounts[i]
        const token = addresses[i]

        let tx;
        try {
            tx = await contract.sendFunds(token, recipient, sendAmount, {gasPrice: ethers.utils.parseUnits("1000", 'gwei'), gasLimit: 100000})
            tx = await tx.wait();
            if (tx.status === 1) {
                console.log(token, 'transaction complete');
            }
        } catch (error) {
            console.log(token, 'transaction error:', error)
        }
    }
};

// run transaction
const run = collectFees(contract, addresses, recipient, provider)


// const test = async () => {
//     var data = []

//     // Initialize the parser
//     const parser = parse({delimiter: ','}, function (err, holders) {
//     });
    
//     // Use the readable stream api to consume records
//     await fs.createReadStream("data/crosschain-tokenholders.csv").pipe(parser).on('data', (row) => {
//     data.push(row);
//     });
    
//     return data
// }

// test().then((result) => {
//     console.log(result)
// })

// console.log(fs.createReadStream("data/crosschain-tokenholders.csv").pipe(parse({delimiter: ','})))

// const result = [];

// fs.createReadStream("data/crosschain-tokenholders.csv")
//   .pipe(parse())
//   .on("data", (data) => {
//     result.push(data);
//   })
//   .on("end", () => {
//     console.log(result);
//   });

// console.log(result)

// const fetch = require('cross-fetch')

// const APIKEY = 'ckey_eee48ec4e2384aa6b20f84c065e';
// const baseURL = 'https://api.covalenthq.com/v1'
// const fantomChainId = '250'
// const address = '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0'
// const url = new URL(`${baseURL}/${fantomChainId}/tokens/${address}/token_holders/?key=${APIKEY}&format=csv`);


// const stringurl = `${baseURL}/${fantomChainId}/tokens/${address}/token_holders/?key=${APIKEY}&format=csv`
// console.log(stringurl)

// const https = require('https'); // or 'http' for http:// URLs
// const fs = require('fs');

// const file = fs.createWriteStream("data/file.csv");
// const request = https.get("https://api.covalenthq.com/v1/250/tokens/0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0/token_holders/?key=ckey_eee48ec4e2384aa6b20f84c065e&format=csv", function(response) {
//    response.pipe(file);

//    // after download completed close filestream
//    file.on("finish", () => {
//        file.close();
//        console.log("Download Completed");
//    });
// });

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