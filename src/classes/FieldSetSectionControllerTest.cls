/** 
 * Copyright (c) 2017 Simranjeet Singh
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
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
        //use the second parameter as the name of the field set defined in your org
        SectionField[] sectionFields = FieldSetSectionController.getOutputFields(testAccount.Id, 'Account_Additional_Information');
        System.assert(sectionFields.size() > 0);
        Test.stopTest();
    }
}
