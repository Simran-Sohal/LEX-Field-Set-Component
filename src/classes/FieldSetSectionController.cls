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
        
        SectionField[] sectionFields = new SectionField[]{};
        
        for(Schema.FieldSetMember fsMember : fieldSet.getFields()){
            Schema.DescribeFieldResult fieldDesc = fieldMap.get(fsMember.getFieldPath()).getDescribe();

            //add field to the section field list only if it is accessible to user
            if (fieldDesc.isAccessible()){
                SectionField field = new SectionField();
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
