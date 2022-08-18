const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(callback){
    let decentralBank = await DecentralBank.deployed();
    decentralBank.issueToken();
    console.log('token issued');
    callback();
}