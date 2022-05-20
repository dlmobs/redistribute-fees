require('dotenv').config();
const ethers = require('ethers');
const contractABI = require('./abis/contract.json')
const erc20ABI = require('./abis/ERC20.json')

const usdcAddress = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"
const contractAddress = "0x8E0dfafD247236B9025d3648F195386caD5b2da1"

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/")

const walletPK = new ethers.Wallet(prcoess.env.ADDRESS_PK, provider)
const contract = new ethers.Contract(contractAddress, contractABI, walletPK)
const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, provider)

// receivers are addresses where money is sent to; tokenAddresses are usdc and ftm
const receivers = ["0xFBbe90DD04250B5E789Ed9d1bFBA2476E524a852", "0x8c128f336B479b142429a5f351Af225457a987Fa"]
const tokenAddresses = ["0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", "0x0000000000000000000000000000000000000000"] // burn contract?

// run transaction
const run = tryTX(contract, provider, usdcContract, receivers, tokenAddresses)

const tryTX = async (contract, provider, usdcContract, recipients, tokenAddresses) => {
    // get available balances first
    const ftm_balance = await provider.getBalance(contract.address)
    const usdc_balance = await usdcContract.balanceOf(contract.address)
    const ftm_sendAmount = Number(ftm_balance) - 1000000000000000000
    const usdc_sendAmount = Number(usdc_balance) - 1000000

    // try transactions, sends usdc and ftm to both recipient addresses
    for (const token in tokenAddresses) {
        // default it to ftm amount, and if usdc token being sent, it reassigns the variable -- make more efficient
        var sendAmount = ftm_sendAmount
        if (token == "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75") {
            var sendAmount = usdc_sendAmount
        }

        for (const recipient in recipients) {
            let tx;
            try {
                tx = await contract.sendFunds(token, recipient, sendAmount);
                tx = await tx.wait();
                if (tx.status === 1) {
                    console.log(token, 'transaction complete');
                }
            } catch (error) {
                console.log(token, 'transaction error:', error)
            }
        }
    }
};