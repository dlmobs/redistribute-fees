require('dotenv').config();
const ethers = require('ethers');
const contractABI = require('./ABI.json')

const contractAddress = "0x8E0dfafD247236B9025d3648F195386caD5b2da1"
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")
const walletPK = new ethers.Wallet(prcoess.env.ADDRESS_PK, provider)
const contract = new ethers.Contract(contractAddress, contractABI, walletPK)
const receivers = ["0xFBbe90DD04250B5E789Ed9d1bFBA2476E524a852", "0x8c128f336B479b142429a5f351Af225457a987Fa"]
const tokenAddresses = ["0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", "0x0000000000000000000000000000000000000000"]

// run transaction
const run = tryTX(contract, provider, receivers, tokenAddresses)

const tryTX = async (contract, provider, recipients, tokenAddresses) => {
    // get available balance first
    const balance = await provider.getBalance(contract.address)
    const sendAmount = Number(balance) - 1000000000000000000

    // try transactions, sends usdc and ftm to both recipient addresses
    for (const token in tokenAddresses) {
        for (const recipient in recipients) {
            let tx;
            try {
                tx = await contract.sendFunds(token, recipient, sendAmount);
                tx = await tx.wait();
                if (tx.status === 1) {
                    console.log('first transaction complete');
                }
            } catch (error) {
                console.log('first transaction error:', error)
            }
        }
    }
};