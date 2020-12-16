import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/common/product';
import { CartItem } from 'src/app/common/cart-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  //New properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productListService: ProductService, 
              private cartService: CartService,
              private route: ActivatedRoute) { } // Accessing the given category Id

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
    
  }

  handleListProducts(){
    // Check if 'id' param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // get the 'id' param string and convert it to a number using '+' symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('categoryName');
    }else{
      // not category id available -> default to category 1 (Books)
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //
    //Check if we have a different category than previous
    //Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    
    // get the products for the given category id
    this.productListService.getProductListPaginate(this.thePageNumber - 1, //pages are 1-based, Spring Data REST->pages are 0-based
                                                  this.thePageSize,
                                                  this.currentCategoryId)
                                                  .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; // Spring Data REST pages are 0-based 
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts(){

    const theKeyword : string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous
    // then set thePageNumber to 1 

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1; // reset
    }

    // keep track of the keywords
    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`); // debug purposes

    // Search for products given that keyword
    this.productListService.searchProductsPaginate(this.thePageNumber - 1,
                                                      this.thePageSize,
                                                      theKeyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts(); // refresh page view
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
