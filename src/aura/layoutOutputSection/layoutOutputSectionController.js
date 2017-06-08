/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - layoutOutputSectionController.js
 *
 * Developer(s) - SSingh
 *
 */
({
    toggleDisplay : function(component, event, helper) {
        var isCollapsible = component.get("v.collapsible");
        
        if (isCollapsible){
            var titleIconDown = component.find("titleIconDown");
            $A.util.toggleClass(titleIconDown, "slds-hide");
            
            var titleIconRight = component.find("titleIconRight");
            $A.util.toggleClass(titleIconRight, "slds-hide");

            var sectionBody = component.find("sectionBody");
            $A.util.toggleClass(sectionBody, "slds-hide");
        }
	}
})