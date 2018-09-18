import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { MarketProvider, User, WeatherProvider } from '../../providers/providers';
import {  MarketModel, LoginModel, DateFilterModel,} from '../../models/models';

import {  BehaviorSubject, Subject } from 'rxjs';
import _ from 'lodash';
import moment from 'moment';
import {  MarketsPage, DateFilterPage } from '../pages';
/**
 * Generated class for the WmcCustomersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wmc-customers',
  templateUrl: 'wmc-customers.html',
})
export class WmcCustomersPage {

  selectedDateIndex: number = -1;
  selectedDateRange:any = null;
  showLoading:boolean = false;
  totalPendingRequestCount:number = 0;

  markets$: BehaviorSubject<{ index: number, markets: MarketModel[]}[]>;
  dates$  : BehaviorSubject<{ index: number, dates: DateFilterModel[]}[]>;

  summary: any = {
    completedYards: 0,
    totalYards: 0,
    totalOrders: 0
  } 

  selectOptions = {
    title: 'Date Filter',
    mode: 'ios'
  };

  units: any = {};

  constructor(public navCtrl: NavController,
              public marketProvider: MarketProvider,
              public modalCtrl:ModalController,
              public events:Events,
              public storage: Storage,
              public user: User,
              public weatherProvider: WeatherProvider) { }

  ngOnDestroy() {
  
    this.destroy();
    console.log('message in ngOnDestroy')
  }

  destroy() {

    this.markets$.complete();
    this.dates$.complete();
  } 
  

  resetValue() {
    this.markets$ = new BehaviorSubject([]);
    this.dates$   = new BehaviorSubject([])
    this.summary.completedYards =  0;
    this.summary.totalYards =  0;
    this.summary.totalOrders = 0;
  } 
  
  ngOnInit() {
    this.markets$  = new BehaviorSubject([]);
    this.dates$   = new BehaviorSubject([])

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WmcCustomersPage');
    this.storage.get('wmc_customers').then((models: LoginModel[]) => {

      this.totalPendingRequestCount = models.length ;
      this.showLoading = true;

      if(models.length > 1) {
        this.events.publish('before:wmc_customer_select', models[0]);
      }

      for(let i = 0; i < models.length; i++) {
        
        this.units['unit_'+i] = models[0].unit;
        let dates$ = this.marketProvider.getDateFilters(i);
        dates$.subscribe(dateFilters => {

          this.selectedDateIndex = 0;
          let currentDateFilter = this.dates$.getValue();
          let dates:any = _.concat(currentDateFilter, [{ index: i, dates: dateFilters }]);
          dates = _.sortBy(dates, [function(date){ return date.index}]);
          this.dates$.next(dates) 
          
          let dateFilter = _.head(dateFilters);
          this.marketProvider.getMarkets(dateFilter, i).subscribe(newCustomerMarkets => { 
            
            let currentCustomermarkets = this.markets$.getValue();
            let markets:any = _.concat(currentCustomermarkets, [{ index: i, markets: newCustomerMarkets }]);
            markets  = _.sortBy(markets, [function(market) { return market.index; }]);
            this.markets$.next(markets);
            this.updateSumary(); 
            this.updateLoader();
          });
        }) 
  
      }
           
     }).catch();
  }

  ionViewDidEnter(){
    if(this.weatherProvider.weather$) {
      this.weatherProvider.unsubscribe_weather$.next();
      this.weatherProvider.unsubscribe_weather$.complete();
    }
    this.events.publish('before:wmc_customer_select', {});
  }
  
  selectDate(forceChange:boolean = false) {
    if(this.selectedDateIndex == -1) {
      return 
    } else if(this.selectedDateIndex == 100 && (forceChange || this.selectedDateRange == null))   {
      this.selectedDateRange = null;
      this.chooseDateRange();
      return 
    } else if(this.selectedDateIndex != 100){
      this.selectedDateRange = null;
    }

    this.markets$.complete();
    this.markets$  = new BehaviorSubject([]);

    let customersDateFilter = this.dates$.getValue() 
    this.totalPendingRequestCount = customersDateFilter.length ;
    this.showLoading = true;
    for(let i = 0; i < customersDateFilter.length; i++) {
      
      let selectedDate = null;
      if(this.selectedDateIndex == 100){
        selectedDate = this.getDateRangeFilter(customersDateFilter[i], this.selectedDateRange)
      }else {
        selectedDate = customersDateFilter[i].dates[this.selectedDateIndex];
      }

      this.marketProvider.getMarkets(selectedDate, i).subscribe(newCustomerMarkets => { 
            
        let currentCustomermarkets = this.markets$.getValue();
        let markets:any = _.concat(currentCustomermarkets, [{ index: i, markets: newCustomerMarkets }]);
        markets  = _.sortBy(markets, [function(market) { return market.index; }]); 
        this.markets$.next(markets);
        this.updateSumary(); 
        this.updateLoader();
      });
          
    }
  }

  getDateRangeFilter(customersDateFilter:any, selectedDateRange:any) {
    let selectedDate;
    let todayDate:DateFilterModel =  customersDateFilter.dates[0];
    let startingTime:string =  todayDate.startDate && _.split(todayDate.startDate, 'T',2)[1] || '';  
    let endingTime:string =  todayDate.endDate && _.split(todayDate.endDate, 'T',2)[1] || '';
    
    let startDate, endDate = "";
    startDate = moment(this.selectedDateRange.startDate).format('YYYY-MM-DD');
    endDate = moment(this.selectedDateRange.endDate).format('YYYY-MM-DD');
    selectedDate = new DateFilterModel({
      display : '('+moment(this.selectedDateRange.startDate).format('MM-DD-YYYY') +" to "+moment(this.selectedDateRange.endDate).format('MM-DD-YYYY')+')',
      startDate: startDate+"T"+startingTime,
      endDate:  endDate+"T"+endingTime
    })

    return selectedDate;
  }
  
  chooseDateRange(){
    let dateFilterModal = this.modalCtrl.create(DateFilterPage, {'defaultRange': this.selectedDateRange});
    dateFilterModal.onDidDismiss(data => {
      console.log('date filter modal',data);
      
      if(data != null && data != 'ignore'){
        this.selectedDateRange = data;
        this.selectDate(false);
      } else if(data == null) {
        this.selectedDateIndex = 0
        this.selectDate(false);
      }
  
    });
    dateFilterModal.present();
  }




  viewMarket(market: { index: number, markets: MarketModel[]}) {
    let selectedDate = null;
    let customersDateFilter = this.dates$.getValue();
    let dateFilter = null;   
    let defaultDateFilterIndex = _.findIndex(customersDateFilter, function(dateFilter){  return dateFilter.index == market.index;}); 
    if (defaultDateFilterIndex > -1) {
      dateFilter = customersDateFilter[defaultDateFilterIndex];
      
      if(this.selectedDateIndex == 100){
        selectedDate = this.getDateRangeFilter(dateFilter, this.selectedDateRange)
      }else {
        selectedDate = dateFilter.dates[this.selectedDateIndex];
      }
      
      this.storage.get('wmc_customers').then((models: LoginModel[]) => {

          let hasDateRange:boolean = this.selectedDateIndex == 100 ? true :false;
          this.events.publish('user:login', models[market.index]);
          this.storage.set('user', models[market.index]);
          this.user._user = models[market.index];
        
          this.navCtrl.push(MarketsPage, {  dateFilter: selectedDate, hasDateRange: hasDateRange});

          // Restart the weather update API
          this.weatherProvider.unsubscribe_weather$ =  new Subject(); 
          this.weatherProvider.weather$ = null;
          this.weatherProvider.weather$ = this.weatherProvider.getWeather();
      })
    }
    
  }

  updateSumary() {
    
    let currentCustomermarkets = this.markets$.getValue();
    let completedYards:number = 0;
    let totalYards: number = 0;
    let totalOrders:number =  0;

    _.each(currentCustomermarkets, function(customermarket){
      if(customermarket.markets && customermarket.markets.length > 0)
      {
        totalYards += customermarket.markets[0].totalYards && _.toNumber(customermarket.markets[0].totalYards) || 0 ;
        completedYards += customermarket.markets[0].completedYards && _.toNumber(customermarket.markets[0].completedYards) || 0 ;
        totalOrders += customermarket.markets[0].totalOrders && _.toNumber(customermarket.markets[0].totalOrders) || 0 ;
      }
    })
  
    this.summary['completedYards'] = _.round(completedYards,2);
    this.summary['totalYards'] = _.round(totalYards,2);
    this.summary['totalOrders'] = _.round(totalOrders,2);
    
  }
  
  updateLoader() {
    this.totalPendingRequestCount--;
    if (this.totalPendingRequestCount <= 0) {
      this.showLoading = false;
    }
  }
  

}
