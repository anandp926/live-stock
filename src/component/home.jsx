import React, { Component } from 'react';
import Header from './header-drawer/header-drawer';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import TimeAgo from 'react-timeago';
import Graph from './graph';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import CanvasGraph from './canvas_graph/index';
import Loader from './loader/loader'
import './home.css';

function PaperComponent(props) {
    return (
      <Draggable>
        <Paper {...props} />
      </Draggable>
    );
  }

class Home extends Component {

    state = {
        stocks: {},
        open: false,
        tickerKey: '',
        canvasStock: [],
        loader: true
    }

    webSocketCall = () => {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        var connection = new WebSocket('ws://stocks.mnet.website/:1337');

        connection.onopen = function () {

        };

        connection.onerror = function (error) {

        };

        connection.onmessage = (message) => {
            try {
                let newStock = {}, up = 0, down = 0;
                let current_time = Date.now();
                newStock = this.state.stocks;

                JSON.parse(message.data).map((stock) => {
                    if (newStock[stock[0]]) {
                        newStock[stock[0]].current_price > stock[1] ? up++ : down++;
                        newStock[stock[0]].current_price = stock[1];
                        newStock[stock[0]].history.push({ time: current_time, price: stock[1] });
                    } else {
                        newStock[stock[0]] = {
                            current_price: stock[1],
                            history: [{
                                time: current_time,
                                price: stock[1]
                            }]

                        }
                    }
                })
                this.setState({ stocks: newStock, loader: false })
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.data);
            }
        }
    }

    componentDidMount() {
        this.webSocketCall();
    }

    ArrowUpdate = (stock) => {
        if(stock.history.slice(-2)[0].price > stock.current_price){
            return <ArrowDropDown className="icon-color-red hideMe" fontSize="large" />
        }else if(stock.history.slice(-2)[0].price < stock.current_price) {
            return <ArrowUpIcon className="icon-color-green hideMe" fontSize="large" />
        }else {return null}
    }

    ColorUpdate = (stock) => {
        if(stock.history.slice(-2)[0].price > stock.current_price){
            return <span className="icon-color-red">{stock.current_price}</span>
        }else if(stock.history.slice(-2)[0].price < stock.current_price) {
            return <span className="icon-color-green">{stock.current_price}</span>
        }else if(stock.history.slice(-2)[0].price === stock.current_price) {
            return <span>{stock.current_price}</span>
        }else {return <span>{stock.current_price}</span>}
    }

    handleClickOpen = (key, stock) => {
        this.setState({ open: true, tickerKey: key, canvasStock: stock });
    };
    
    handleClose = () => {
        this.setState({ open: false, tickerKey: '', canvasStock: [] });
    };

    render() {
        return (
            <Header>
                {
                    this.state.loader
                    ? <Loader/>
                    : null
                }
                <div className="home-container flex-column">
                    <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                    fullWidth={true}
                    >
                    <DialogTitle id="draggable-dialog-title">{this.state.tickerKey}</DialogTitle>
                    <DialogContent>
                        <CanvasGraph stock={this.state.canvasStock} stockKey={this.state.tickerKey}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Close
                        </Button>
                    </DialogActions>
                    </Dialog>
                    <div className="home-table" style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>TICKER</th>
                                    <th>PRICE</th>
                                    <th>LAST UPDATE</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.stocks !== null && this.state.stocks !== undefined && (
                                        Object.keys(this.state.stocks).map((key, index) => (
                                            <tr key={index} onClick={() => this.handleClickOpen(key, this.state.stocks[key])}>
                                                <td>{key}</td>
                                                <td>
                                                    {this.ColorUpdate(this.state.stocks[key])}
                                                    {this.ArrowUpdate(this.state.stocks[key])}
                                                </td>
                                                <td><TimeAgo date={this.state.stocks[key].history.slice(-1)[0].time} /></td>
                                                <td><Graph stock = {this.state.stocks[key] }/></td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Header>
        )
    }
}


export default Home