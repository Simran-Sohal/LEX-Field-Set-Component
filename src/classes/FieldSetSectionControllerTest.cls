/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - FieldSetSectionControllerTest
 *
 * Description  - Test class for (1) FieldSetSectionController (2) SectionField
 *
 * Developer(s) - SSingh
 */
@isTest(seeAllData=false)
private class FieldSetSectionControllerTest {

    @testSetup
    static void createTestData(){
        Account testAccount = new Account();
        testAccount.Name = 'Test Account';
        testAccount.AnnualRevenue = 5000000;
        testAccount.Industry = 'Energy';
        testAccount.NumberOfEmployees = 150;
        testAccount.Rating = 'Hot';
        
        insert testAccount;
    }

    @isTest
    private static void testGetOutputFields(){
        Account testAccount = [SELECT Id FROM Account WHERE Name = 'Test Account' LIMIT 1];
        
        Test.startTest();
        SectionField[] sectionFields = FieldSetSectionController.getOutputFields(testAccount.Id, 'fsLtng__Account_Additional_Information');
        System.assert(sectionFields.size() > 0);
        Test.stopTest();
    }
}