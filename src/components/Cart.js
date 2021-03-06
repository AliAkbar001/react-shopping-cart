import React, { Component } from 'react'
import formatCurrency from '../util';
import Fade from "react-reveal/Fade"
import { connect } from 'react-redux';
import { removeFromCart } from '../actions/cartAction';
import {createOrder, clearOrder} from '../actions/orderAction';
import { Model } from 'mongoose';
import { Zoom } from "react-reveal";

class Cart extends Component {
    constructor(props){
        super(props);
        this.state = { 
            showCheckout:false,
            name:"",
            email:"",
            address:"", 
        };
    }
    handleInput = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }
    createOrder = (e) => {
        e.preventDefault();
        const order = {
            name: this.state.name,
            email: this.state.email,
            address: this.state.address,
            cartItems: this.props.cartItems,
            total: this.props.cartItems.reduce((a, c) => a + c.price * c.count, 0),
        };
        console.log("Hello World");
        this.props.createOrder(order);
    };
    closeModal = () => {
        this.props.closeModal();
    };
    render() {
        const {cartItems, order} = this.props;
        return (
            <div>
                <div>
                    {cartItems.length === 0 ? (
                        <div className="cart cart-header">Cart is empty</div>
                    ) : (
                        <div className="cart cart-header">
                            You have {cartItems.length} in the cart {" "}
                        </div>
                    )}
                </div>
                {
                    order && <Model isOpen={true} onRequestClose={this.closeModal}>
                        <Zoom>
                            <button className="close-modal" onClick={this.closeModal}>X</button>
                            <div className="order-details">
                                <h2>Order {order._id}</h2>
                                <ul>
                                    <li>
                                        <div>Name:</div>
                                        <div>{order.name}</div>
                                    </li>
                                    <li>
                                        <div>Email:</div>
                                        <div>{order.email}</div>
                                    </li>
                                    <li>
                                        <div>Address:</div>
                                        <div>{order.address}</div>
                                    </li>
                                    <li>
                                        <div>Total:</div>
                                        <div>{order.total}</div>
                                    </li>
                                    <li>
                                        <div>Cart Items:</div>
                                        <div>{order.cartItems.map((x) => (
                                            <div>
                                                {x.count} {" x "} {x.title}
                                            </div>
                                        ))}</div>
                                    </li>
                                </ul>
                            </div>
                        </Zoom>
                    </Model>
                }
                <div className="cart">
                    <Fade left cascade>
                    <ul className="cart-items">
                        {cartItems.map(item =>(
                            <li key={item._id}>
                                <div>
                                    <img src={item.image} alt={item.title}/>
                                </div>
                                <div>
                                    <div>{item.title}</div>
                                    <div className="right">
                                        {formatCurrency(item.price)} x {item.count} {" "}
                                        <button className="button" onClick={()=>this.props.removeFromCart(item)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    </Fade>
                </div>
                {cartItems.length!==0 && (
                    <div>
                    <div className="cart"> 
                        <div className="total">
                            Total:{" "}
                            <div>{formatCurrency(cartItems.reduce((a, c) => a + c.price * c.count, 0))}</div>
                        </div>
                        <button onClick={()=>this.setState({showCheckout:true})} className="button primary">Proceed</button>              
                    </div>
                    {this.state.showCheckout && (
                        <Fade right cascade>
                        <div className="cart">
                            <form onSubmit={this.createOrder}>
                                <ul className="form-container">
                                    <li>
                                        <label>Email:</label>
                                        <input type="email" name="email" required onChange={this.handleInput}/>
                                    </li>
                                    <li>
                                        <label>Name:</label>
                                        <input type="text" name="name" required onChange={this.handleInput}/>
                                    </li>
                                    <li>
                                        <label>Address:</label>
                                        <input type="address" name="address" required onChange={this.handleInput}/>
                                    </li>
                                    <li>
                                        <button type="submit" className="button primary">Checkout</button>
                                    </li>
                                </ul>
                            </form>
                        </div>
                        </Fade>
                    )}            
                    </div>             
                )}
            </div>
        )
    }
}

export default connect(
    (state) => ({
        order: state.order.order,
        cartItems: state.cart.cartItems,
    }),{
        removeFromCart,
        createOrder,
        clearOrder
})(Cart);