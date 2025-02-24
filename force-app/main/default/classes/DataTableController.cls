public with sharing class DataTableController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId, Integer pageSize, Integer pageNumber, String sortBy, String sortDirection) {

        if (accountId == null) {
            return new List<Contact>();
        }

        String  orderByClause = 'ORDER BY ' + sortBy + ' ' + sortDirection;
        Integer offset = (pageNumber - 1) * pageSize;

        String query = 'SELECT Id, FirstName, LastName, Email FROM Contact WHERE AccountId = :accountId ' 
                     + orderByClause 
                     + ' LIMIT :pageSize OFFSET :offset';

  
        return Database.query(query);
    }
}