import { api, LightningElement, track, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import DATA_IMPORT from '@salesforce/schema/DataImport__c';
import PAYMENT_FIELD from '@salesforce/schema/DataImport__c.Payment_Method__c';
import donationHistoryDatatableAriaLabel from '@salesforce/label/c.donationHistoryDatatableAriaLabel';
import RD2_ScheduleVisualizerColumnDate from '@salesforce/label/c.RD2_ScheduleVisualizerColumnDate';
import getDonationHistory from '@salesforce/apex/ListDonation.getDonationHistory';
import getTotalRecords from '@salesforce/apex/ListDonation.getTotalRecords';
import commonAmount from '@salesforce/label/c.commonAmount';
import donorLabel from '@salesforce/label/c.donorLabel';
export default class DonationHistoryTable extends LightningElement {
    @api contactId;

    paymentMethodLabel;

    totalNumberOfRows;

    data = [];

    label = {
        donationHistoryDatatableAriaLabel,
    }

    columns = [];

    @wire(getObjectInfo, { objectApiName: DATA_IMPORT })
    oppInfo({ data, error }) {
        if (data) {
            this.paymentMethodLabel = data.fields[PAYMENT_FIELD.fieldApiName].label
        };
        this.columns = [
            { label: RD2_ScheduleVisualizerColumnDate, fieldName: 'closeDate', type: 'date', typeAttributes:{
                year: "numeric",
                month: "short",
                day: "2-digit"
            },
            cellAttributes: { alignment: 'right' }},
            { label: donorLabel, fieldName: 'name', type: 'text' },
            { label: commonAmount, fieldName: 'amount', type: 'currency', },
            { label: this.paymentMethodLabel, fieldName: 'paymentMethod', type: 'text', },
        ];
    }
    
    // eslint-disable-next-line @lwc/lwc/no-async-await
    async connectedCallback() {
        getTotalRecords({contactId: this.contactId})
        .then({
            if(data){
                this.totalNumberOfRows = data[0].expr0;
            }
        });
        getDonationHistory({contactId: this.contactId, offset: 0})
        .then(data => {
            if (data) {
                this.data = data;
            }
        });
    }

    /**
     * 
     * @param {*} event 
     * handle the scroll event to get more content and concat to the existing table data
     */
    loadMoreDonationData(event){
        if (this.data.length >= this.totalNumberOfRows) {
            event.target.enableInfiniteLoading = false;
            return;
        }
        getDonationHistory({contactId: this.contactId, offset: this.data.length})
        .then(data => {
            const currentData = this.data;
            const newData = currentData.concat(data);
            this.data = newData;
        });
    }
}