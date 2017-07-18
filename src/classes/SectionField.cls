/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - SectionField
 *
 * Description  - Structure to keep the attributes related to 
 *                an SObject field along with the value
 *
 * Developer(s) - SSingh
 */
global class SectionField {
    @AuraEnabled global String  fieldName   {get; set;}
    @AuraEnabled global String  fieldType   {get; set;}
    @AuraEnabled global String  fieldLabel  {get; set;}
    @AuraEnabled global Object  fieldValue  {get; set;}
    @AuraEnabled global Boolean isRequired  {get; set;}
}