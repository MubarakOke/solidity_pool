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
    it("allows user to enter pool", async()=>{
        await poolContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei("2","ether")})
        let enteredUser= await poolContract.methods.getPlayers().call({from: accounts[1]})
        assert.equal(accounts[0], enteredUser[0])
    })
    it("does'nt allow value less than 0.02 ether", async()=>{
        try{
            await poolContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei("0.01","ether")}) 
        }
        catch(err){
            assert(err)
            return
        }
        assert(false)
    })
    it("doesn't allow non manager to pick a winner", async()=>{
        try{
            await poolContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei("2","ether")})
            await poolContract.methods.pickWinner().send({from: accounts[1]})
        }
        catch (err){
            assert(err)
            return
        }
        assert(false)
    })
    it("allows different user to enter and winner is picked", async()=>{
        await poolContract.methods.enter().send({from: accounts[1], value: web3.utils.toWei("2","ether")})
        const initialBalance= await web3.eth.getBalance(accounts[1])
        await poolContract.methods.pickWinner().send({from: accounts[0]})
        const newBalance= await web3.eth.getBalance(accounts[1])
        assert(newBalance > initialBalance)


    })
})