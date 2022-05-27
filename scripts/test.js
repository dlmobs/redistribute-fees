// fully automated script

require('dotenv').config();
const ethers = require('ethers');
const path = require('path')
const spawn = require("child_process").spawn;

const erc20ABI = require('../abis/ERC20.json')
const allAddresses = require('../data/addresses.json')
// const { downloadCSVfiles } = require('./getCSVfiles')
// const { collectFees } = require('./collectRewards')
const BigNumber = require('bignumber.js')

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")
const wallet = allAddresses[250].addresses.feesRecipient.address


const automate = async () => {
    // get balance in wallet after converting ftm to usdc
    const usdcAddress = allAddresses[250].tokens.usdc.address
    const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)
    const usdc_balance = BigNumber(15684535755865887453423446786795342)
    return usdc_balance

}

automate().then((ans) => {
    console.log("-----------------------------------------")
    console.log(ans.toString())
    })

