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
    // const ftm_sendAmount = BigNumber(Number(ftm_balance)).dividedToIntegerBy(1000000000000000000).minus(1).multipliedBy(1000000000000000000)
    // const usdc_sendAmount = BigNumber(Number(usdc_balance)).dividedToIntegerBy(1000000).minus(1).multipliedBy(1000000000000000000)
    const ftm_available = BigNumber(Number(ftm_balance)).dividedToIntegerBy(1000000000000000000)
    const usdc_available = BigNumber(Number(usdc_balance)).dividedToIntegerBy(1000000)

    const ftm_sendAmount = ftm_available.dividedBy(10).integerValue(BigNumber.ROUND_DOWN).multipliedBy(10).multipliedBy(1000000000000000000)
    const usdc_sendAmount = usdc_available.dividedBy(10).integerValue(BigNumber.ROUND_DOWN).multipliedBy(10).multipliedBy(1000000000000000000)

    const available = [ftm_sendAmount.toNumber(), usdc_sendAmount.toNumber(), ftm_available.toNumber(), usdc_available.toNumber()]
    return available
};

availableFees(contractAddress, provider, usdcContract).then((ans) => {
    console.log("-----------------------------------------")
    console.log(`Contract Balance: ${ans[2]} FTM and ${ans[3]} USDC`)
    console.log(`Sending: ${ans[0]/(1000000000000000000)} FTM and ${ans[1]/(1000000000000000000)} USDC`)
    console.log("-----------------------------------------")
    })

module.exports = {
    availableFees
}