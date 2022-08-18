import React, {Component} from "react";
import tether from '../img/tether.png'

class Main extends Component {
    render(){
        return(
            <div id="content" className="mt-3">
                <table className="table text-center text-muted">
                    <thead>
                        <tr style={{color:'white'}}>
                            <th scope="col">Stacking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'white'}}>
                            <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} USDT</td>
                            <td>{window.web3.utils.fromWei(this.props.stackingBalance, 'Ether')} RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div className="card mb-2" style={{opacity:.9}}>
                    <form className="mb-3">
                        <div style={{borderSpace:'0 1em'}}>
                            <label className="float-left" style={{marginLeft:'15px'}}>
                                <b>Stack Tokens</b>
                            </label>
                            <span className="float-right" style={{marginRight:'8px'}}>
                                Balance: {window.web3.utils.fromWei(this.props.tetherBalance, 'Ether')}
                            </span>
                            <div className="input-group mb-4">
                                <input type="text" placeholder="0" required/>
                                <div className="input-group-open">
                                    <div className="input-group-text">
                                        <img src={tether} height='32' alt='tether'/> &nbsp;&nbsp; USDT
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg btn-block">DEPOSIT</button>
                        </div>
                    </form>
                    <button type="submit" className="btn btn-primary btn-lg btn-block">WITHDRAW</button>
                    <div className="card-body text-center" style={{color:'blue'}}>
                    AIRDROP
                    </div>
                </div>
            </div>
        )
    }
}

export default Main;