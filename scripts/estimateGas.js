// estimate gas price using ethers to ensure transaction doesn't fail

const ethers = require('ethers');

const estimatePrice = async (provider) => {
    const gasPrice = await provider.getGasPrice()
    const gasPriceWei = ethers.utils.formatUnits(gasPrice, "gwei")
    
    return gasPriceWei
}

module.exports = {
    estimatePrice
}