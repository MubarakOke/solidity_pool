const assert= require('assert')
const ganache= require('ganache-cli')
const Web3= require('web3')
const {interface, bytecode}= require('../compiler')

const web3= new Web3(ganache.provider())

let accounts
let poolContract
beforeEach(async()=>{
    accounts= await web3.eth.getAccounts()
    poolContract= await new web3.eth.Contract(JSON.parse(interface)).deploy({data: bytecode, arguements: []}).send({from: accounts[0], gas: "1000000"})
})

describe("POOL", ()=>{
    it("deploys a contract", ()=>{
        assert.ok(poolContract.options.address)
    })
})