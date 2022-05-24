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
const { estimatePrice } = require('./estimateGas')

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
    // Estimate Gas Price
    const gasPriceWei = await estimatePrice(provider)
    console.log("Estimated Gas Price", gasPriceWei)

    // amount of usdc and ftm available
    const tokenAmounts = await availableFees(contractAddress, provider, usdcContract)
    const sendingAmounts = tokenAmounts.slice(0, 2)

    // try transactions, sends usdc and ftm to recipient address
    for (const i in sendingAmounts) {
        const sendAmount = String(sendingAmounts[i])
        const token = addresses[i]

        let tx;
        try {
            tx = await contract.sendFunds(token, recipient, sendAmount, {gasPrice: ethers.utils.parseUnits(gasPriceWei, 'gwei'), gasLimit: 100000})
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