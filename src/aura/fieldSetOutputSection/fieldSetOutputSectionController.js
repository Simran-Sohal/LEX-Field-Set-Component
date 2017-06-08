/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - fieldSetOutputSectionController.js
 *
 * Developer(s) - SSingh
 *
 */
({
	doInit : function(component, event, helper) {
        helper.setSectionBody(component, event, helper);
	},
    
    hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.addClass(spinner, "slds-hide");    
    }
})