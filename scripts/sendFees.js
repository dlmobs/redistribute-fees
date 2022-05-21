require('dotenv').config();
const ethers = require('ethers');
const contractABI = require('../abis/contract.json')
const erc20ABI = require('../abis/ERC20.json')
const allAddresses = require('../data/contracts.json')
const { availableFees } = require('./amountAvailable')

const usdcAddress = allAddresses[250].tokens.usdc.address
const ftmAddress = allAddresses[250].tokens.ftm.address
const addresses = [ftmAddress, usdcAddress]
const contractAddress = allAddresses[250].addresses.treasury.address

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

const walletPK = new ethers.Wallet(prcoess.env.ADDRESS_PK, provider)

// contractAddress to contract ethers object, and usdc address to usdc contract ethers object
const contract = new ethers.Contract(contractAddress, contractABI, walletPK)
const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)

// receivers are addresses where money is sent to; tokenAddresses are usdc and ftm
const recipient = allAddresses[250].addresses.feesRecipient.address

const tryTX = async (contract, addresses, recipient) => {
    // usdc and ftm available
    const tokenAmounts = await availableFees(contractAddress, provider, usdcContract)

    // try transactions, sends usdc and ftm to both recipient addresses
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
const run = tryTX(contract, addresses, recipient)