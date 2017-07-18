/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - relatedRecordsTableController.js
 *
 * Developer(s) - SSingh
 *
 */
({
	doInit : function(component, event, helper) {
        helper.populateDataTable(component, event, helper);
	},

	addRows : function(component, event, helper) {
        helper.createDataTable(component, event, helper);
	},
    
    hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.addClass(spinner, "slds-hide");    
    },

    toggleDisplay : function(component, event, helper) {
        var isCollapsible = component.get("v.collapsible");

        if (isCollapsible){
            var hideLink = component.find("hideLink");
            $A.util.toggleClass(hideLink, "slds-hide");    
            
            var showLink = component.find("showLink");
            $A.util.toggleClass(showLink, "slds-hide");    
            
            var tableBody = component.find("tableBody");
            $A.util.toggleClass(tableBody, "slds-hide"); 
            
            var tablefooter = component.find("tablefooter");
            $A.util.toggleClass(tablefooter, "slds-hide"); 
        }
    }
})