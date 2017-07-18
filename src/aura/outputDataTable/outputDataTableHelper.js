/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - outputDataTableHelper.js
 *
 * Developer(s) - SSingh
 *
 */
({
	createTableRows : function(component, event, helper) {
        var tableRows = component.get("v.rows");
        var maxRows = component.get("v.maxRowsDisplayed");
        
        var totalRows = tableRows.length;
        console.log("Total Rows : " + totalRows);
        
        if (maxRows == null || maxRows == undefined){
            maxRows = totalRows;
        }
        if (maxRows > totalRows){
            maxRows = totalRows;
        }
        console.log("Rows to be dispalyed : " + maxRows);
        
        var dataRows = component.get("v.dataRows");
        for(var i = 0; i < maxRows; i++){
            $A.createComponent(
                "c:outputDataRow",{
                    "fields" : tableRows[i].fields,
                },
                function(newRow, status, errorMessage){
                    if (status === "SUCCESS") {
                        dataRows.push(newRow);
                        component.set("v.dataRows", dataRows);
                    }
                }
            );
        };
	}
})