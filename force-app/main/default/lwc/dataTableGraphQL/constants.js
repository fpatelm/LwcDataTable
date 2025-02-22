export { 
    GRAPH_QL_QUERY
};

const GRAPH_QL_QUERY = `
             query getContacts($accountId: ID!, $pageSize: Int!, $after: String, $sortParam: Contact_OrderBy){
                uiapi {
                    query {
                        Contact(
                            where: {
                                AccountId: { eq: $accountId }
                            },
                            first: $pageSize,
                            after: $after,
                            orderBy: $sortParam
                        ) {
                            edges {
                                node {
                                    Id
                                    FirstName {
                                        value
                                    }
                                    LastName {
                                        value    
                                    }
                                   Email {
                                        value
                                   }   
                                }
                            }
                            totalCount
                            pageInfo {
                                endCursor
                                hasNextPage
                                hasPreviousPage
                            }
                        }
                    }
                }
            }
         `;
