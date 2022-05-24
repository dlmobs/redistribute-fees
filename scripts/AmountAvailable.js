// get amount available in fees contract

const ethers = require('ethers');
const erc20ABI = require('../abis/ERC20.json')
const addresses = require('../data/addresses.json')
const BigNumber = require('bignumber.js')

const usdcAddress = addresses[250].tokens.usdc.address
const contractAddress = addresses[250].addresses.treasury.address // unidex treasury contract

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")
const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)

const availableFees = async (contract, provider, usdcContract) => {
    // get available balances
    const ftm_balance = await provider.getBalance(contract)
    const usdc_balance = await usdcContract.balanceOf(contract)
    const ftm_sendAmount = BigNumber(Number(ftm_balance)).dividedToIntegerBy(1000000000000000000).minus(1).multipliedBy(1000000000000000000)
    const usdc_sendAmount = BigNumber(Number(usdc_balance)).dividedToIntegerBy(1000000).minus(1).multipliedBy(1000000000000000000)
    const available = [ftm_sendAmount, usdc_sendAmount]
    return available
};

availableFees(contractAddress, provider, usdcContract).then((ans) => {
    console.log((ans[0]).dividedBy(1000000000000000000).toNumber(), "FTM")
    console.log((ans[1]).dividedBy(1000000000000000000).toNumber(), "USDC")
    })

module.exports = {
    availableFees
}