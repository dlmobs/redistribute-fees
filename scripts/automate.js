// fully automated script

require('dotenv').config();
const ethers = require('ethers');
const path = require('path')
const spawn = require("child_process").spawn;

const erc20ABI = require('../abis/ERC20.json')
const allAddresses = require('../data/addresses.json')
const { downloadCSVfiles } = require('./getCSVfiles')
const { collectFees } = require('./collectRewards')

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")
const wallet = allAddresses[250].addresses.feesRecipient.address


const automate = async () => {
    // get csv files
    const runDownload = downloadCSVfiles()

    // collect rewards from contract
    const collect = collectFees()

    // wait 5 minutes - 300 seconds - 300000 ms
    await new Promise(resolve => setTimeout(resolve, 300000));

    // get balance in wallet after converting ftm to usdc
    const usdcAddress = allAddresses[250].tokens.usdc.address
    const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)
    const usdc_balance = await usdcContract.balanceOf(wallet) // 1e6

    const pythonProcess = spawn('python',[path.join(__dirname, "holdersFees.py"), usdc_balance]);
}



