/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - relatedRecordsTableHelper.js
 *
 * Developer(s) - SSingh
 *
 */
({
	populateDataTable : function(component, event, helper) {
        console.log('Fetching data from server ...');
        var action = component.get("c.getRecords");
        action.setParams(
            {
                "pRecordId" : component.get("v.recordId"),
                "pRelatedObjectName" : component.get("v.relatedObjectName"),
                "pRelationshipName" : component.get("v.relationshipName"),
                "pFieldsString" : component.get("v.fieldsString"),
                "pSortByFieldsString" : component.get("v.sortByfields"),
                "pIsAscending" : component.get("v.ascending")
            }
        );

        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var dataTable = response.getReturnValue();
                if(!$A.util.isEmpty(dataTable) && !$A.util.isUndefined(dataTable)){
                    component.set("v.dataTable", dataTable);
                    var totalRows = dataTable.rows.length;
                    component.set("v.totalRows", totalRows);
                    
                    if (totalRows > 0){
                        helper.createDataTable(component, event, helper);
                    }
                    else {
                        helper.setNoRecordsFound(component, helper);                    
                    }
                } else {
                    helper.setNoRecordsFound(component, helper);                    
                }
            } 
            else if (state === "INCOMPLETE") {
                helper.setTextMessage(component, $A.get("$Label.fsLtng.No_response_from_server"));                    
            } 
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log(errors[0].message);
                        helper.setTextMessage(component, $A.get("$Label.fsLtng.Unexpected_Server_Side_Error"));                    
                    }
                }
            }
        });
        $A.enqueueAction(action);
	},
    
    createDataTable : function(component, event, helper) {
        console.log('Creating data table ...');
        var dataTable = component.get("v.dataTable");
        var totalRows = parseInt(component.get("v.totalRows"));
        var rowsToBeDisplayed = parseInt(component.get("v.maxNumberOfRows"));
        var maxRowsDisplayed = (totalRows > rowsToBeDisplayed ? rowsToBeDisplayed : totalRows);
        
        $A.createComponent(
            "c:outputDataTable",{
                "columns" : dataTable.columns,
                "rows" : dataTable.rows,
                "maxRowsDisplayed" : rowsToBeDisplayed
            },
            function(relatedRecTable, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set("v.relatedRecords", relatedRecTable);
                    helper.setRowAttributes(component);
                    
                    var showHideAction = component.find('tableShowHideAction');
                    $A.util.removeClass(showHideAction, "slds-hide");
                }
            }
        );        
	},

    setRowAttributes : function(component){
        var totalRows = parseInt(component.get("v.totalRows"));
        var rowsToBeDisplayed = parseInt(component.get("v.maxNumberOfRows"));
        
        var rowsNotDisplayed = totalRows - rowsToBeDisplayed;
        if (rowsNotDisplayed < 0){
            rowsNotDisplayed = 0;
        }
        component.set("v.rowsNotDisplayed", rowsNotDisplayed);
        
        var showMore = component.find('showMoreRowsLink'); //This returns the anchor <a> tag
        var showMoreLabel = '';
        
        if (rowsNotDisplayed == 0){
            $A.util.addClass(showMore, "slds-hide");
        }
        else {
            $A.util.removeClass(showMore, "slds-hide");
            if (rowsNotDisplayed > 0 && rowsNotDisplayed < rowsToBeDisplayed){
                rowsToBeDisplayed = rowsToBeDisplayed + rowsNotDisplayed;
                showMoreLabel = $A.get("$Label.fsLtng.Show_Records_Label") + ' ' + rowsNotDisplayed.toString() + ' ' + $A.get("$Label.fsLtng.More_Records_Label");
            }
            else if (rowsNotDisplayed > 0 && rowsNotDisplayed >= rowsToBeDisplayed){
                showMoreLabel = $A.get("$Label.fsLtng.Show_Records_Label") + ' ' + rowsToBeDisplayed.toString() + ' ' + $A.get("$Label.fsLtng.More_Records_Label");
                rowsToBeDisplayed = rowsToBeDisplayed * 2;
            }
        }
        
        //records to be displayed on next show more click
        component.set("v.maxNumberOfRows", rowsToBeDisplayed);
        
        //set the text for the show more rows text 
        $A.createComponent(
            "ui:outputText",{
                "value" : showMoreLabel
            },
            function(showMoreLink, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set("v.showMoreRowsText", showMoreLink);
                }
            }
        );        
        
    },
    
    setNoRecordsFound : function(component, helper){
        helper.setTextMessage(component, $A.get("$Label.fsLtng.No_records_to_display") );

        var showHideAction = component.find('tableShowHideAction');
        $A.util.addClass(showHideAction, "slds-hide");
    },

    setTextMessage : function(component, text){
        $A.createComponent(
            "ui:outputText",{
                "value" : text,
                "class" : "slds-align_absolute-center"
            },
            function(defaultText, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set("v.relatedRecords", defaultText);
                }
            }
        );        
    }
})