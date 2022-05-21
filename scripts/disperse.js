/* disperse fees 
*/

const ethers = require('ethers');
const allAddresses = require('../data/addresses.json')
const disperseABI = require('../abis/disperse.json')

// all addresses needed
const usdcAddress = allAddresses[250].tokens.usdc.address

const contractAddress = allAddresses[250].addresses.disperseContract.address

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

// wallet with write permissions, treasury, and usdc ethers objects (wallet is the address with access to write treasury contract)
const walletPK = new ethers.Wallet(process.env.ADDRESS_PK, provider)
const contract = new ethers.Contract(contractAddress, contractABI, walletPK)

// holders to receive funds
//ADD THIS CONSTANT

const distribute = async (contract, recipients, usdcAddress) => {
    // amount of usdc and ftm available
    const tokenAmounts = await availableFees(contractAddress, provider, usdcContract)

    // try transactions, sends usdc and ftm to recipient address
    for (const i in tokenAmounts) {
        const sendAmount = tokenAmounts[i]
        const token = addresses[i]

        // console.log("sendAmount", sendAmount)
        // console.log("token", token)
        // console.log("recipient", recipient)
        // console.log()

        let tx;
        try {
            tx = await contract.sendFunds(token, recipient, sendAmount)
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
const run = tryTX(contract, addresses, recipients)