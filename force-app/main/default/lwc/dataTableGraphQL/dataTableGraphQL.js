import { LightningElement, api, wire } from 'lwc';
import { gql, graphql } from "lightning/uiGraphQLApi";
import { GRAPH_QL_QUERY } from './constants'; 
const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName', sortable: true },
    { label: 'Last Name', fieldName: 'LastName', sortable: true },
    { label: 'Email', fieldName: 'Email', sortable: true }
];

export default class DataTableGraphQL extends LightningElement {
    data = [];

    columns = COLUMNS;
    sortBy = 'LastName';
    sortDirection ='ASC';
    totalRecords = 0;
    pageSize = 10;
    pageNumber = 0;
    isLoading = false;
    sortParam = {
        [this.sortBy]:{ order: this.sortDirection.toUpperCase() }
    };   
    pageInfo;
    after;

    _recordId;
    @api 
    set recordId(value) {
        if (value) {
            this._recordId = value;
        }
    }

    get recordId() {
        return this._recordId;
    }

    graphqlData;  
    @wire(graphql, {
        query: '$myQuery',
        variables: '$params'
    })         
    graphqlQueryResult(result) {
        this.isLoading = false;
        this.graphqlData = result;

        const { data, error } = result;

        if (data) {
            this.pageInfo = data.uiapi.query.Contact.pageInfo;
            this.totalRecords = data.uiapi.query.Contact.totalCount;
 
            let newRecords = data.uiapi.query.Contact.edges.map((edge) => ({
                Id: edge.node.Id,
                FirstName: edge.node.FirstName?.value || '',
                LastName: edge.node.LastName?.value || '',
                Email: edge.node.Email?.value || ''
            }));
            this.data = [...this.data, ...newRecords];
        }
        if (error) {
            console.error(error);
        }
    }
    

    get myQuery() { 
         return gql`${GRAPH_QL_QUERY}`;
    }
    get params() {
        return {
            accountId: this.recordId || '001WU00000fyjknYAA',
            pageSize: this.pageSize,
            after: this.after || null,
            sortParam: this.sortParam,
        };
    }

    handleSort(event) {
        this.after= '';
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortParam = {
            [this.sortBy]:{ order: this.sortDirection.toUpperCase() }
        };        
        this.data = [];
    }
    handleLoadMore() { 
        if(this.pageInfo?.hasNextPage) {            
            this.isLoading = true;
            this.after = this.pageInfo.endCursor;
            this.pageNumber++;
        }
    }    
}