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
global with sharing class FieldSetSectionController {
    
    @AuraEnabled
    global static SectionField[] getOutputFields(Id pRecordId
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
            if (fsMember.getFieldPath().equalsIgnoreCase('Id')
                    || fsMember.getFieldPath().equalsIgnoreCase('Name'))
                continue;

            //add field to the query string only if it is accessible to user
            if (fieldMap.get(fsMember.getFieldPath()).getDescribe().isAccessible()){
                queryFieldString += fsMember.getFieldPath() + ', ';
            }
        }
        queryFieldString += 'Id, Name ';
        
        String recordSOQL = 'SELECT ' + queryFieldString + ' FROM ' + sObjectName + ' WHERE Id = :pRecordId';
        System.debug(loggingLevel.DEBUG, 'Record Query : ' + recordSOQL);

        SObject sObjRecord = Database.query(recordSOQL);
        System.debug(loggingLevel.DEBUG, 'Record : ' + sObjRecord);
        
        SectionField[] sectionFields = new SectionField[]{};
        
        for(Schema.FieldSetMember fsMember : fieldSet.getFields()){
            //add field to the section field list only if it is accessible to user
            if (fieldMap.get(fsMember.getFieldPath()).getDescribe().isAccessible()){
                SectionField field = new SectionField();
                field.fieldName  = fsMember.getFieldPath();
                field.fieldLabel = fsMember.getLabel();
                field.fieldType  = String.valueOf(fsMember.getType());
                field.fieldValue = sObjRecord.get(fsMember.getFieldPath());
                field.isRequired = (fsMember.getDBRequired() || fsMember.getRequired());
                sectionFields.add(field);
            }
        }
        
        return sectionFields;
    }

}