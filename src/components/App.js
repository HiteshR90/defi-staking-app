import React,{Component} from "react";
import './App.css';
import Navbar from './Navbar';
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main';
import ParticaleSettings from './ParticleSettings';

class App extends Component {

    async componentDidMount(){
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3(){
        //check metamask is there or not
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.currentProvider);
        } else {
            window.alert('No ethereum broweser detected! please install or check Metamask');
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        this.setState({account:account[0]});
        const networkId = await web3.eth.net.getId();

        //load tether contract
        const tetherData = Tether.networks[networkId];
        if(tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({tether: tether});

            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({ tetherBalance: tetherBalance.toString()});
        } else {
            window.alert('Tether contact not deployed to network');
        }

         //load rwd contract
         const rwdData = RWD.networks[networkId];
         if(rwdData) {
             const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
             this.setState({rwd: rwd});
 
             let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
             this.setState({rwdBalance: rwdBalance.toString()});
 
         } else {
             window.alert('Reward Token contact not deployed to network');
         }

          //load dcenteralBank contract
        const decentralBankData = DecentralBank.networks[networkId];
        if(decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            this.setState({decentralBank: decentralBank});

            let stackingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({stackingBalance: stackingBalance.toString()});

        } else {
            window.alert('DecentralBank contact not deployed to network');
        }

        this.setState({loading: false});
    }

    //Stacking function
    stackToken = (amount) =>{
        this.setState({loading: true});
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from:this.state.account}).on('transactionHash', (hash) =>{
            this.state.decentralBank.methods.depositTokens(amount).send({from:this.state.account}).on('transactionHash', (hash) =>{
                this.setState({loading: false});
            });
        });
    }
    //unstacking function
    unstackToken = () =>{
        this.setState({loading: true});
        this.state.decentralBank.methods.unStackToken().send({from:this.state.account}).on('transactionHash', (hash) =>{
            this.setState({loading: false});
        });
    }

    constructor(props){
        super(props);
        this.state = {
            account :'abc',
            tether :{},
            rwd:{},
            dcenteralBank:{},
            tetherBalance:'0',
            rwdBalance:'0',
            stackingBalance:'0',
            loading:true
        }
    }

    render() {
        let content =  this.state.loading ? 
        <p id="loader" className="text-center" style={{margin:'30px', color:'white'}}>LOADING...</p>:
        <Main tetherBalance={this.state.tetherBalance}
        rwdBalance={this.state.rwdBalance}
        stackingBalance={this.state.stackingBalance}
        stackToken={this.stackToken}
        unstackToken={this.unstackToken}/>;

        return(
            <div className="App" style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                 <ParticaleSettings/>
                </div>
                <Navbar account={this.state.account}></Navbar>
                <h1 className="container-fluid mt-5">
                    <div className="row ">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px', minHeigh:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </h1>
            </div>
        )
    }
}

export default App;