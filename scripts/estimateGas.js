// estimate gas price using ethers to ensure transaction doesn't fail

const ethers = require('ethers');

const estimatePrice = async (provider) => {
    const gasPrice = await provider.getGasPrice()
    const gasPriceWei = ethers.utils.formatUnits(gasPrice, "gwei")
    
    return gasPriceWei
}

// const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

// estimatePrice(provider).then((ans) => {
//     console.log(typeof(ans))
//     })

module.exports = {
    estimatePrice
}