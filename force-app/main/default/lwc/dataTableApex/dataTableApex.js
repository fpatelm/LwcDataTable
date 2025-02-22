import { LightningElement, api  } from 'lwc';
import getContacts from '@salesforce/apex/DataTableController.getContacts';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName', sortable: true },
    { label: 'Last Name', fieldName: 'LastName', sortable: true },
    { label: 'Email', fieldName: 'Email', sortable: true }
];
export default class DataTableApex extends LightningElement {
    @api recordId;
    data = [];

    columns = COLUMNS;
    sortBy = 'LastName';
    sortDirection ='ASC';
    totalRecords = 0;
    pageSize = 10;
    pageNumber = 1;
    isLoading = false;
    stopLoad = false;

    connectedCallback() {
        this.loadContacts();
    }

    loadContacts() {
        if (this.isLoading) return;
        this.isLoading = true;

       return getContacts({
            accountId: this.recordId,
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection
        })
           .then(result => {
               if (result.length == 0) return this.stopLoad = result.length == 0;     
               this.data = [...this.data, ...result];
            
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleLoadMore(event) {
        const { target } = event;
        if (this.stopLoad) return;
        target.isLoading = true;
        this.pageNumber++;
        this.loadContacts()
            .then(()=> {
                target.isLoading = false;
        });   
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.pageNumber = 1;
        this.data = [];
        this.loadContacts()
            .then(()=> {
                this.isLoading = false;
        });  
    }
}