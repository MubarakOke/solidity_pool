const path= require('path')
const fs= require('fs')
const solc= require('solc')

const poolPath= path.resolve(__dirname, 'contracts', 'pool.sol')
const source= fs.readFileSync(poolPath, 'utf8')

module.exports= solc.compile(source, 1).contracts[':Pool']