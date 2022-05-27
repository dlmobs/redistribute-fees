/* disperse fees 
*/

require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs'); 
const { parse } = require('csv-parse');
const { transpose } = require('mathjs')
const { finished } = require('stream/promises')
const { estimatePrice } = require('./estimateGas')
const allAddresses = require('../data/addresses.json')
const disperseABI = require('../abis/disperse.json')

// all addresses needed
const usdcAddress = allAddresses[250].tokens.usdc.address
const contractAddress = allAddresses[250].addresses.disperseContract.address

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

// wallet with write permissions, treasury, and usdc ethers objects (wallet is the address with access to write treasury contract)
const walletPK = new ethers.Wallet(process.env.DISTRIBUTER_PK, provider)
const contract = new ethers.Contract(contractAddress, disperseABI, walletPK)

// format csv information to input into disperse function
const processFile = async () => {
    const records = [];
    const parser = fs.createReadStream('data/crosschain-tokenholders.csv').pipe(parse());
    parser.on('readable', function(){
        let record; while ((record = parser.read()) !== null) {
            // Work with each record
            records.push(record);
        }
    });
    await finished(parser);
    return transpose(records);
};

// disperse fees
const distribute = async () => {
    const holders = await processFile()

    // Estimate Gas Price
    const gasPriceWei = await estimatePrice(provider)
    console.log("Estimated Gas Price", gasPriceWei)

    let tx;
    try {
        tx = await contract.disperseToken(usdcAddress, 
            ["", ""], // holders[0]
            [1000000,1000000], // holders[1] - need to convert this properly (large number needed) - this is 1 usdc
            {gasPrice: ethers.utils.parseUnits(gasPriceWei, 'gwei'), gasLimit: 100000})

        tx = await tx.wait();
        if (tx.status === 1) {
            console.log('transaction complete');
        }
    } catch (error) {
        console.log('transaction error:', error)
    }
};

// run transaction
const run = distribute()