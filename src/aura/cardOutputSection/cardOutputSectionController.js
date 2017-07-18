/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - cardOutputSectionController.js
 *
 * Developer(s) - SSingh
 *
 */
({
    toggleDisplay : function(component, event, helper) {
        var isCollapsible = component.get("v.collapsible");

        if (isCollapsible){
            var hideLink = component.find("hideLink");
            $A.util.toggleClass(hideLink, "slds-hide");    
            
            var showLink = component.find("showLink");
            $A.util.toggleClass(showLink, "slds-hide");    
            
            var sectionBody = component.find("sectionBody");
            $A.util.toggleClass(sectionBody, "slds-hide");    
        }
    }
})