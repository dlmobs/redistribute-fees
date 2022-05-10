require('dotenv').config();
const ethers = require('ethers');
// const contractABI = require('./abis/contract.json')
const erc20ABI = require('./abis/ERC20.json')

const usdcAddress = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"
const contractAddress = "0x8E0dfafD247236B9025d3648F195386caD5b2da1"

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

// const walletPK = new ethers.Wallet(prcoess.env.ADDRESS_PK, provider)
// const contract = new ethers.Contract(contractAddress, contractABI, walletPK)
const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)

// receivers are addresses where money is sent to; tokenAddresses are usdc and ftm
const receivers = ["0xFBbe90DD04250B5E789Ed9d1bFBA2476E524a852", "0x8c128f336B479b142429a5f351Af225457a987Fa"]
const tokenAddresses = ["0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", "0x0000000000000000000000000000000000000000"]

// run transaction
// const run = tryTX(contract, provider, usdcContract, receivers, tokenAddresses)

const tryTX = async (contract, provider, usdcContract, recipients, tokenAddresses) => {
    // get available balances first
    const ftm_balance = await provider.getBalance(contract)
    const usdc_balance = await usdcContract.balanceOf(contract)
    const ftm_sendAmount = Number(ftm_balance) - 1000000000000000000
    const usdc_sendAmount = Number(usdc_balance) - 1000000
    const ans = [ftm_sendAmount/1000000000000000000, usdc_sendAmount/1000000]
    return ans
};

tryTX(contractAddress, provider, usdcContract, receivers, tokenAddresses).then((ans) => {
    console.log(ans[0], "FTM")
    console.log(ans[1], "USDC")
  })