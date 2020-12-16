import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AEshopFormService } from 'src/app/services/aeshop-form.service';
import { Country } from 'src/app/common/country';
import { Province } from 'src/app/common/province';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  shippingAddressProvinces: Province[] = [];
  billingAddressProvince: Province[] = [];

  totalPrice: number;
  totalQuantity: number;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder,
              private aeshopFormService: AEshopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group({
          firstName: [''],
          lastName: [''],
          email: ['']
        }),
        shippingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          province: [''],
          country: [''],
          zipCode: ['']
        }),
        billingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          province: [''],
          country: [''],
          zipCode: ['']
        }),
        creditCard: this.formBuilder.group({
          cardType: [''],
          nameOnCard: [''],
          cardNumber: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: ['']
        })
      }
    );

    // populate credit card months
      const startMonth: number = new Date().getMonth() + 1;
      console.log('StartMonth: ' + startMonth);

      this.aeshopFormService.getCreditCardMonths(startMonth).subscribe(
        data=> {
          console.log('Retrieved credit card months ' + JSON.stringify(data));
          this.creditCardMonths = data;
        }
      );

    // populate credit card years
      this.aeshopFormService.getCreditCardYears().subscribe(
        data=> {
          console.log('Retrieved credit card years ' + JSON.stringify(data));
          this.creditCardYears = data;
        }
      );

      // populate countries
      this.aeshopFormService.getCountries().subscribe(
        data=> {
          console.log('Retrieved countries ' + JSON.stringify(data));
          this.countries = data;
        }
      );

  }

  getProvinces(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.aeshopFormService.getProvinces(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressProvinces = data;
        }else{
          this.billingAddressProvince = data;
        }

        // select the first state as the default
        formGroup.get('province').setValue(data[0]);
      }
    );
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1; // 0-based
    }else{
      startMonth = 1;
    }

    this.aeshopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address province is " + this.checkoutFormGroup.get('shippingAddress').value.province.name);
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );

      // bug fix code for provinces
      this.billingAddressProvince = this.shippingAddressProvinces;
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      // buf¡g fix code for provinces
      this.billingAddressProvince = [];
    }

  }

}
