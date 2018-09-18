import _ from 'lodash';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { User, MarketProvider } from '../../providers/providers';
import { MarketModel, DateFilterModel, LoginModel } from '../../models/models';
import { RegionsPage, WmcCustomersPage, DateFilterPage, OrdersPage } from '../pages';
import { Subject } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-markets',
  templateUrl: 'markets.html'
})
export class MarketsPage implements OnInit {

  showLoading:boolean = false;
  selectedDate: any;
  selectedDateRange:any = null;
  dateFilters:DateFilterModel[];

  markets$: Subject<MarketModel[]>;
  dates$  : Observable<DateFilterModel[]>;

  selectOptions = {
    title: 'Date Filter',
    mode: 'ios'
  };

  units: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public marketProvider: MarketProvider,
              public storage: Storage,
              public user: User) { }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    this.markets$.complete();
  } 

  ngOnInit() {
    
    this.showLoading = true;
    this.markets$  = new Subject();

  }
  
  ionViewDidLoad() {
    let selectedDateFilter =  this.navParams.get('dateFilter');
    let hasDateRange:boolean =  this.navParams.get('hasDateRange');
    
    this.storage.get('wmc_customers').then((models: LoginModel[]) => { 
      if(models.length > 1 &&  !selectedDateFilter)
      {
         this.navCtrl.setRoot(WmcCustomersPage);
      }
    }).catch();


    this.storage.get('user').then((model: LoginModel) => { this.units = model && model.unit 

      if(model) {

        console.log('selectedDateFilter',selectedDateFilter);
        this.dates$ = this.marketProvider.getDateFilters();
        this.dates$.subscribe(dateFilters => {
          this.dateFilters = dateFilters;
          let dateFilter = _.head(dateFilters);
          this.selectedDate = dateFilter;
          if(selectedDateFilter) {
            if(hasDateRange){
              this.selectedDate = 100;
              this.selectedDateRange = selectedDateFilter;
              dateFilter  = this.selectedDateRange;
            }
            else {
              let defaultDateFilterIndex = _.findIndex(dateFilters, function(dateFilter){  return dateFilter.display == selectedDateFilter.display;}); 
              if (defaultDateFilterIndex > -1) {
                this.selectedDate = dateFilters[defaultDateFilterIndex];
                dateFilter = dateFilters[defaultDateFilterIndex];
              }
            }
            
          }
          this.marketProvider.getMarkets(dateFilter).subscribe(markets => { 
            this.markets$.next(markets); 
            this.showLoading = false;
          });
        });
      }
     
    }).catch();

    
  }

  selectDate() {
  
    if(isNaN(this.selectedDate)) {
      this.selectedDateRange = null;
    }
    else if(!isNaN(this.selectedDate) && _.parseInt(this.selectedDate) == 100 && this.selectedDateRange == null) {
      this.selectedDateRange = null;
      this.chooseDateRange();
      return; 
    }

    let filterDate:DateFilterModel;
    if(!isNaN(this.selectedDate) && _.parseInt(this.selectedDate) == 100 && this.selectedDateRange) {
      filterDate = this.selectedDateRange;
    } else {
      filterDate = this.selectedDate;
    }
    this.showLoading = true;
    this.marketProvider.getMarkets(filterDate).subscribe(markets => { 
      this.markets$.next(markets) 
      this.showLoading = false;
    });
  
  }

  viewRegions(market: MarketModel) {
    
    let filterDate:DateFilterModel;
    if(!isNaN(this.selectedDate) && _.parseInt(this.selectedDate) == 100 && this.selectedDateRange) {
      filterDate = this.selectedDateRange;
    } else {
      filterDate = this.selectedDate;
    }

    if(_.lowerCase(market.class) == 'plant'){
      market.id && this.navCtrl.push(OrdersPage, { region: market, dateFilter: filterDate });
      
    } else {
      market.id && this.navCtrl.push(RegionsPage, { market: market, dateFilter: filterDate});
    }
  }

  chooseDateRange(){
    let dateFilterModal = this.modalCtrl.create(DateFilterPage,{'defaultRange': this.selectedDateRange});
    dateFilterModal.onDidDismiss(data => {
      console.log('date filter modal',data);
      if(data != null && data != 'ignore'){
        this.selectedDateRange = this.getDateRangeFilter(this.dateFilters, data) 
        this.selectDate();
      } else if(data == null) {
        this.selectedDate = this.dateFilters[0];
        this.selectDate();
      }
  
    });
    dateFilterModal.present();
  }

  getDateRangeFilter(customersDateFilter:DateFilterModel[], selectedDateRange:any) {
    let selectedDate;
    let todayDate:DateFilterModel =  customersDateFilter[0];
    let startingTime:string =  todayDate.startDate && _.split(todayDate.startDate, 'T',2)[1] || '';  
    let endingTime:string =  todayDate.endDate && _.split(todayDate.endDate, 'T',2)[1] || '';
    
    let startDate, endDate = "";
    startDate = moment(selectedDateRange.startDate).format('YYYY-MM-DD');
    endDate = moment(selectedDateRange.endDate).format('YYYY-MM-DD');
    selectedDate = new DateFilterModel({
      display : '('+moment(selectedDateRange.startDate).format('MM-DD-YYYY') +" to "+moment(selectedDateRange.endDate).format('MM-DD-YYYY')+')',
      startDate: startDate+"T"+startingTime,
      endDate:  endDate+"T"+endingTime
    })

    return selectedDate;
  }


}
