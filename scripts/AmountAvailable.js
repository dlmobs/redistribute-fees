// get amount available in fees contract

const ethers = require('ethers');
const erc20ABI = require('../abis/ERC20.json')
const addresses = require('../data/contracts.json')

const usdcAddress = addresses[250].tokens.usdc.address
const contractAddress = addresses[250].contracts.address // unidex fees contract

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")
const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)

const availableFees = async (contract, provider, usdcContract) => {
    // get available balances
    const ftm_balance = await provider.getBalance(contract)
    const usdc_balance = await usdcContract.balanceOf(contract)
    const ftm_sendAmount = Number(ftm_balance) - 1000000000000000000
    const usdc_sendAmount = Number(usdc_balance) - 1000000
    const available = [ftm_sendAmount, usdc_sendAmount]
    return available
};

availableFees(contractAddress, provider, usdcContract).then((ans) => {
    console.log(ans[0]/1000000000000000000, "FTM")
    console.log(ans[1]/1000000, "USDC")
    })

module.exports = {
    availableFees
}