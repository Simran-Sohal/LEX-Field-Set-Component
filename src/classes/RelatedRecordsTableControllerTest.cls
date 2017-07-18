/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - RelatedRecordsTableControllerTest
 *
 * Description  - Test class for (1) RelatedRecordsTableController
 *                               (2) DataTable
 *                               (3) Row
 *
 * Developer(s) - SSingh
 */
@isTest(seeAllData=false)
private class RelatedRecordsTableControllerTest {

    @testSetup
    static void createTestData(){
        Account testAccount = new Account();
        testAccount.Name = 'Avengers Corp';
        testAccount.AnnualRevenue = 5000000;
        testAccount.Industry = 'Energy';
        testAccount.NumberOfEmployees = 150;
        testAccount.Rating = 'Hot';
        insert testAccount;
        System.assert(testAccount.Id != null);

        Contact testContact = new Contact();
        testContact.FirstName = 'Tony';
        testContact.LastName = 'Stark';
        testContact.Phone = '6501234567';
        testContact.Email = 'tony.s@avengers.com';
        testContact.AccountId = testAccount.Id;
        insert testContact;
        System.assert(testContact.Id != null);
        
        //following labels are added to automically add them to the package
        String label_1 = Label.Hide_Records_Label;
        String label_2 = Label.More_Records_Label;
        String label_3 = Label.Show_Records_Label;
        String label_4 = Label.No_records_to_display;
        String label_5 = Label.No_response_from_server;
        String label_6 = Label.Invalid_SObject_Relationship;
        String label_7 = Label.Unexpected_Server_Side_Error;
    }

    @isTest
    private static void testGetRecords(){
        Account testAccount = [SELECT Id FROM Account WHERE Name = 'Avengers Corp' LIMIT 1];
        
        Test.startTest();
        DataTable relatedRecords = RelatedRecordsTableController.getRecords(testAccount.Id
                                                                          , 'Contact'
                                                                          , 'Contacts'
                                                                          , 'FirstName, LastName, AccountId, Email, Phone'
                                                                          , 'LastName, FirstName'
                                                                          , true);
        System.assert(relatedRecords != null);
        System.assert(relatedRecords.rows.size() == 1);
        Test.stopTest();
    }

    @isTest
    private static void testGetRecords_NegativeScenarios(){
        Account testAccount = [SELECT Id FROM Account WHERE Name = 'Avengers Corp' LIMIT 1];
        
        Test.startTest();
        DataTable relatedRecords = RelatedRecordsTableController.getRecords(null
                                                                          , 'Contact'
                                                                          , 'Contacts'
                                                                          , 'FirstName, LastName, Email, Phone'
                                                                          , 'LastName, FirstName'
                                                                          , true);
        System.assert(relatedRecords == null);
        
        Boolean hasError = false;
        try{
            relatedRecords = RelatedRecordsTableController.getRecords(testAccount.Id
                                                                    , 'Contact'
                                                                    , 'fsLtng__Contact__r'
                                                                    , 'FirstName, LastName, Email, Phone'
                                                                    , 'LastName, FirstName'
                                                                    , true);
        }
        catch (Exception e){
            hasError = true;
        }
        System.assert(hasError);
        System.assert(relatedRecords == null);
        
        Test.stopTest();
    }

}