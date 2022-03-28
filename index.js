const ethers = require("ethers")
const fs = require('fs')
const config = require('./config.json')

const writeToJSONFile = (filename, json) => {
    fs.writeFileSync(`./${filename}.json`, JSON.stringify(json, null, '\t'), {
      flag: 'w',
      encoding: 'utf8',
    });
};

const wait = (ms) => new Promise(res => setTimeout(() => {
    res(0)
}, ms))


const provider = new ethers.providers[config.providerType](config.providerURL)
let allTx = {}

if(config.oldFilePath){
    const a = require(config.oldFilePath)
    allTx = JSON.parse(JSON.stringify(a))
}

const run = async () => {
    const latestBlock = await provider.getBlock('latest')
    console.log('Latest block is: ', latestBlock.number)
    let n = config.startBlock
    while (n <= latestBlock.number) {
        console.log("processing: ",n)
        const bt = await provider.getBlockWithTransactions(n)
        for(tx of bt.transactions){
            if(tx.creates){
                allTx[tx.creates] = n
                writeToJSONFile(config.jsonFileName, allTx)
            }
        }
        n++
        await wait(config.sleepMilliseconds)
    }
}

run()
