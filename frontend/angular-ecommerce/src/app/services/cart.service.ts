import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []; // Our shopping cart - An array of CartItem objects

  totalPrice: Subject<number> = new Subject<number>(); //Subject is a subclass of Observable - Use it to publish events in our code
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){

      //find the item in the cart based on the item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      // 'find' returns the first element that passes else returns undefined

      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
     //increment the quantity
     existingCartItem.quantity++; 
    }else{
      //add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }

  }

  remove(theCartItem: CartItem) {
     
    // get the index of the item in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id);
    
    // if found. remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1); // remove 1 item from the array

      this.computeCartTotals();
    }   
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive new data
    this.totalPrice.next(totalPriceValue); // .next(..) publish/send event
    this.totalQuantity.next(totalQuantityValue);
    // This ^^ will publish events to all subscribers. One event for totalPrice and another for totalQuantity
  
    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue)
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    console.log(`Contents of the cart`);

    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice:${this.totalPrice}, totalQuantity:${this.totalQuantity}`);
    console.log('-----')
  }
}
