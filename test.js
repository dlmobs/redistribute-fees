require('dotenv').config();
const ethers = require('ethers');
const erc20ABI = require('./abis/ERC20.json')

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")
const usdcContract = new ethers.Contract("0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", erc20ABI, provider)



const tryTX = async (provider, usdcContract) => {
    // get available balance first
    const ftm_balance = await provider.getBalance("0x8E0dfafD247236B9025d3648F195386caD5b2da1")
    const usdc_balance = await usdcContract.balanceOf("0x8E0dfafD247236B9025d3648F195386caD5b2da1")
    return usdc_balance
    // const sendAmount = balance - 1000000000000000000

};

tryTX(provider, usdcContract).then((result) => {
    console.log(Number(result)/1000000)
  })