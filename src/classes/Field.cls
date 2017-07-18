/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - Field
 *
 * Description  - Structure to keep the attributes related to 
 *                an SObject field along with the value
 *
 * Developer(s) - SSingh
 *
 * Modification(s)
 *   10-Jul-2017        Added attribute fieldDisplayValue
 *   This attribute is populated for reference fields and 
 *   keeps the name of the record whose Id is stored in the
 *   reference or lookup field
 *
 *
 */
global class Field {

    @AuraEnabled global String  fieldName     {get; set;}
    @AuraEnabled global String  fieldLabel    {get; set;}
    @AuraEnabled global String  fieldType     {get; set;}
    @AuraEnabled global Object  fieldValue    {get; set;}
    @AuraEnabled global Boolean isRequired    {get; set;}
    @AuraEnabled global Integer fieldPosition {get; set;}
    @AuraEnabled global String  fieldHelpText {get; set;}

    //Added for supporting reference fields
    @AuraEnabled global String  fieldDisplayValue {get; set;}
}
