public with sharing class DataTableController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId, Integer pageSize, Integer pageNumber, String sortBy, String sortDirection) {

        if (accountId == null) {
            return new List<Contact>();
        }

        // Default sorting
     /*    String orderByClause = 'ORDER BY LastName ASC';
        if (sortBy != null && sortDirection != null) {
            orderByClause = 'ORDER BY ' + sortBy + ' ' + sortDirection;
        } */

        String  orderByClause = 'ORDER BY ' + sortBy + ' ' + sortDirection;
        Integer offset = (pageNumber - 1) * pageSize;

        // Dynamic SOQL Query
        String query = 'SELECT Id, FirstName, LastName, Email FROM Contact WHERE AccountId = :accountId ' 
                     + orderByClause 
                     + ' LIMIT :pageSize OFFSET :offset';

  
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllContacts(Id accountId) {
        system.debug( [SELECT Id, FirstName, LastName, Email FROM Contact WHERE AccountId = :accountId LIMIT 10]);
        return [SELECT Id, FirstName, LastName, Email FROM Contact WHERE AccountId = :accountId LIMIT 10];
    }
}