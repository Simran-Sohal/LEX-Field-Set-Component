/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - RelatedRecordsTableController
 *
 * Description  - Apex Controller for Related Records Table 
 *                Lightning Component
 *
 * Developer(s) - SSingh
 */
global with sharing class RelatedRecordsTableController {

    @AuraEnabled
    global static DataTable getRecords(String pRecordId
                                     , String pRelatedObjectName
                                     , String pRelationshipName
                                     , String pFieldsString
                                     , String pSortByFieldsString
                                     , Boolean pIsAscending){
        
        if (String.isBlank(pRecordId) || String.isBlank(pRelatedObjectName) || String.isBlank(pRelationshipName)){
            return null;                                     
        }

        Id recordId = Id.valueOf(pRecordId);
        
        /* Declaring local variables to handle SOQL Injection */
        String relatedObjectName = String.escapeSingleQuotes(pRelatedObjectName);
        String relationshipName = String.escapeSingleQuotes(pRelationshipName);
        String fieldsString = String.escapeSingleQuotes(pFieldsString);
        String sortByFieldsString = String.escapeSingleQuotes(pSortByFieldsString);

        /* 
         * validate the relationship
         */
        List<Schema.ChildRelationship> childRelationships = recordId.getSObjectType().getDescribe().getChildRelationships();
        Schema.DescribeSObjectResult relateObjDesc;
        String relationshipFieldName;
        
        for (Schema.ChildRelationship childObj : childRelationships){
            if (childObj.getChildSObject().getDescribe().getName().equalsIgnoreCase(relatedObjectName)
                    && childObj.getRelationshipName().equalsIgnoreCase(relationshipName)){
                relateObjDesc = childObj.getChildSObject().getDescribe();
                relationshipFieldName = childObj.getField().getDescribe().getName();
            }
        }
        
        if (String.isBlank(relationshipFieldName)){
            throw new RelatedRecordsException(Label.Invalid_SObject_Relationship);
        }
        
        //if the related object is not accessible to the user then return null
        if (!relateObjDesc.isAccessible()){
            return null;
        }
        
        /*
         * eliminate invalid and duplicate fields
         */
        Map<String, Schema.SObjectField> fieldMap = relateObjDesc.fields.getMap();
        Map<String, Schema.SObjectField> accessibleFieldMap = new Map<String, Schema.SObjectField>();
        
        for (String fieldName : fieldMap.keySet()){
            //only add accessible fields to the map
            if (fieldMap.get(fieldName).getDescribe().isAccessible()){
                accessibleFieldMap.put(fieldName.toLowerCase(), fieldMap.get(fieldName));
            }
        }
        
        Map<Integer, String> positionToFieldMap = new Map<Integer, String>();
        Set<String> uniqueFields = new Set<String>();
        Integer columnPosition = 0;
        
        //put Id field on 0 position
        positionToFieldMap.put(columnPosition, 'id');
        uniqueFields.add('id');
        columnPosition++;
        
        fieldsString = String.isBlank(fieldsString) ? '' : fieldsString;
        String[] fieldList = fieldsString.split(',');
        
        for (String field : fieldList){
            String fieldName = field.trim().toLowerCase();
            if (!uniqueFields.contains(fieldName) && accessibleFieldMap.containsKey(fieldName)){
                Schema.DescribeFieldResult fieldDesc = accessibleFieldMap.get(fieldName).getDescribe();
                
                positionToFieldMap.put(columnPosition, fieldName);
                columnPosition++;
                
                if (fieldDesc.getType() == Schema.DisplayType.Picklist){
                    uniqueFields.add('toLabel(' + fieldDesc.getName().toLowerCase() + ')');
                }
                else if (fieldDesc.getType() == Schema.DisplayType.Reference){
                    uniqueFields.add(fieldDesc.getName().toLowerCase());
    
                    String refRelationName = fieldDesc.getRelationshipName().toLowerCase();
                    uniqueFields.add(refRelationName + '.id');
                    uniqueFields.add(refRelationName + '.name');
                }
                else {
                    uniqueFields.add(fieldDesc.getName().toLowerCase());
                }
            }
        }
        
        if (positionToFieldMap.size() == 1){ //if no field added to the map then add Name field
            positionToFieldMap.put(columnPosition, 'name');
            columnPosition++;
        }                                 
        
        /*
         * query related records
         */
        List<String> queryFieldList = new List<String>(uniqueFields);
        String relatedRecordsSOQL = 'SELECT ' + String.join(queryFieldList, ',') +
                                     ' FROM ' + relateObjDesc.getName() +
                                    ' WHERE ' + relationshipFieldName + ' = :recordId';
        
        //preparing order by clause
        String orderByClause;
        String sortOrder = (pIsAscending ? 'ASC': 'DESC');
        
        if (String.isNotBlank(sortByFieldsString)){
            String[] sortByFieldList = sortByFieldsString.split(',');
            List<String> orderByClauseList = new List<String>();

            for (String field : sortByFieldList){
                String fieldName = field.trim().toLowerCase();
                if (accessibleFieldMap.containsKey(fieldName)){
                    orderByClauseList.add(fieldName + ' ' + sortOrder);
                }
            }
            orderByClause = ' ORDER BY ' + String.join(orderByClauseList, ',');
        }
        else {
            orderByClause = ' ORDER BY ' + positionToFieldMap.get(1) + ' ' + sortOrder;
        }
        
        //prepare SOQL
        relatedRecordsSOQL = relatedRecordsSOQL + orderByClause;
        
        //execute SOQL
        List<SObject> relatedRecords = Database.query(relatedRecordsSOQL);

        /*
         * prepare response
         */
        DataTable recordTable = new DataTable();
        recordTable.columns = new Field[]{};
        recordTable.rows = new Row[]{};
        
        // prepare table columns data
        for(Integer colPosition : positionToFieldMap.keySet()){
            if (colPosition == 0) continue; //Do not include name Id column in table columns
            Schema.DescribeFieldResult fieldDesc = accessibleFieldMap.get(positionToFieldMap.get(colPosition)).getDescribe();
            Field column = new Field();
            column.fieldPosition = colPosition;
            column.fieldName = fieldDesc.getName();
            column.fieldLabel = fieldDesc.getLabel();
            column.fieldType = String.valueOf(fieldDesc.getType());
            column.fieldHelpText = fieldDesc.getInlineHelpText();
            recordTable.columns.add(column);
        }
        
        // prepare table rows data
        for(SObject relatedRecord : relatedRecords){
            Row row = new Row();
            row.fields = new Field[]{};
            
            for (Field column : recordTable.columns){
                Schema.DescribeFieldResult fieldDesc = accessibleFieldMap.get(positionToFieldMap.get(column.fieldPosition)).getDescribe();
                
                Field field = new Field();
                field.fieldPosition = column.fieldPosition;
                field.fieldName = column.fieldName;
                field.fieldType = column.fieldType;

                if (column.fieldName == 'Name'){
                    field.fieldLabel = String.valueOf(relatedRecord.get('Name'));
                    field.fieldValue = String.valueOf(relatedRecord.get('Id'));
                }
                else{
                    field.fieldLabel = column.fieldLabel;
                    field.fieldValue = relatedRecord.get(column.fieldName);
                    if (fieldDesc.getType() == Schema.DisplayType.Reference && 
                            field.fieldValue != null){
                        SObject refRecord = relatedRecord.getSObject(fieldDesc.getRelationshipName());
                        field.fieldDisplayValue = String.valueOf(refRecord.get('Name'));
                    }
                    else {
                        field.fieldDisplayValue = String.valueOf(field.fieldValue);
                    }
                } 
                    
                row.fields.add(field);
            }
            
            recordTable.rows.add(row);
        }
        
        return recordTable;
    }

    global class RelatedRecordsException extends Exception {}
    
}