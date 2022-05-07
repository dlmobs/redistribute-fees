require('dotenv').config();
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")




const tryTX = async (provider) => {
    // get available balance first
    const balance = await provider.getBalance("0x8E0dfafD247236B9025d3648F195386caD5b2da1")
    return balance
    // const sendAmount = balance - 1000000000000000000

};

tryTX(provider).then((result) => {
    console.log(Number(result)/1000000000000000000)
  })