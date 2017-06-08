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
