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
    doInit : function(component, event, helper) {
        var isCollapsible = component.get("v.collapsible");
        var isHiddenByDefault = component.get("v.hiddenByDefault");
        
        //hide the section body 
        if (isCollapsible && isHiddenByDefault){
            var hideLink = component.find("hideLink");
            $A.util.addClass(hideLink, "slds-hide");    
            
            var showLink = component.find("showLink");
            $A.util.removeClass(showLink, "slds-hide");    
            
            var sectionBody = component.find("sectionBody");
            $A.util.addClass(sectionBody, "slds-hide");    
        }
    },
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