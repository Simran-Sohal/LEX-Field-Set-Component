/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - FieldSetSectionController
 *
 * Description  - Apex Controller for Field Set Output Section 
 *                Lightning component
 *
 * Developer(s) - SSingh
 */
global with sharing class FieldSetSectionController {
    
    @AuraEnabled
    global static Field[] getOutputFields(Id pRecordId
                                        , String pFieldSetName){
        Schema.SObjectType sObjectType = pRecordId.getSobjectType();
        Map<String, Schema.FieldSet> fieldSetMap = sObjectType.getDescribe().fieldSets.getMap();
        Map<String, Schema.SObjectField> fieldMap = sObjectType.getDescribe().fields.getMap();

        if (!fieldSetMap.containsKey(pFieldSetName)){
            return null;
        }
        
        Schema.FieldSet fieldSet = fieldSetMap.get(pFieldSetName);
        String sObjectName = sObjectType.getDescribe().getName();
        String queryFieldString = '';
        for(Schema.FieldSetMember fsMember : fieldSet.getFields()){
            Schema.DescribeFieldResult fieldDesc = fieldMap.get(fsMember.getFieldPath()).getDescribe();
            //skip if field is not accessible
            if (!fieldDesc.isAccessible())
                continue;

            //skip if Id or Name field
            if (fieldDesc.getName().equalsIgnoreCase('Id')
                    || fieldDesc.getName().equalsIgnoreCase('Name'))
                continue;

            //add field to the query string
            if (fieldDesc.getType() == Schema.DisplayType.Picklist){
                queryFieldString += 'toLabel(' + fieldDesc.getName() + '), ';
            }
            else {
                queryFieldString += fieldDesc.getName() + ', ';
            }
            
            if (fieldDesc.getType() == Schema.DisplayType.Reference){
                queryFieldString += fieldDesc.getRelationshipName() + '.Id, ';
                queryFieldString += fieldDesc.getRelationshipName() + '.Name, ';
            }
        }
        queryFieldString += 'Id, Name ';
        
        //prepare SOQL
        String recordSOQL = 'SELECT ' + queryFieldString + ' FROM ' + sObjectName + ' WHERE Id = :pRecordId';
        
        //execute SOQL
        SObject sObjRecord = Database.query(recordSOQL);
        
        //populate fields details
        Field[] sectionFields = new Field[]{};
        for(Schema.FieldSetMember fsMember : fieldSet.getFields()){
            Schema.DescribeFieldResult fieldDesc = fieldMap.get(fsMember.getFieldPath()).getDescribe();

            //add field to the section field list only if it is accessible to user
            if (fieldDesc.isAccessible()){
                Field field = new Field();
                field.fieldName  = fieldDesc.getName();
                field.fieldLabel = fieldDesc.getLabel();
                field.isRequired = (fsMember.getDBRequired() || fsMember.getRequired());
                field.fieldValue = sObjRecord.get(fieldDesc.getName());
                field.fieldType  = String.valueOf(fieldDesc.getType());
                field.fieldHelpText = fieldDesc.getInlineHelpText();
                sectionFields.add(field);
                
                //set display value for Reference field
                if (fieldDesc.getType() == Schema.DisplayType.Reference && field.fieldValue != null){
                    SObject refRecord = sObjRecord.getSObject(fieldDesc.getRelationshipName());
                    field.fieldDisplayValue = String.valueOf(refRecord.get('Name'));
                }
                else {
                    field.fieldDisplayValue = String.valueOf(field.fieldValue);
                }
            }
        }

        return sectionFields;
    }
    
}