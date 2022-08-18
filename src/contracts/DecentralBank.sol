pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;

  address[] public stakers;

  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(RWD _rwd, Tether _tether) public {
      rwd = _rwd;
      tether = _tether;
      owner = msg.sender;
  }

  // staking function   
  function depositTokens(uint _amount) public {

    // require staking amount to be greater than zero
    require(_amount > 0, 'amount cannot be 0');
    
    // Transfer tether tokens to this contract address for staking
    tether.transferFrom(msg.sender, address(this), _amount);

    // Update Staking Balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    // Update Staking Balance
      isStaking[msg.sender] = true;
      hasStaked[msg.sender] = true;
  }

  function unStackToken() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'stacking balance should be >0');

    tether.transfer(msg.sender, balance);

    stakingBalance[msg.sender] = 0;
    
    isStaking[msg.sender] = false;
    hasStaked[msg.sender] = false;
  }

  function issueToken() public{
    require(msg.sender == owner, 'Caller must be owner only');
    for(uint i=0; i < stakers.length; i++){
      address staker = stakers[i];
      uint balance = stakingBalance[staker] / 9;
      if(balance >0 ){
         rwd.transfer(staker, balance);
      }
    }
  }

}