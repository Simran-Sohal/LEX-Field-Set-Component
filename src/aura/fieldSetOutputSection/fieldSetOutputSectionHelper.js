/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - fieldSetOutputSectionHelper.js
 *
 * Developer(s) - SSingh
 *
 */
({
	setSectionBody : function(component, event, helper) {
		var action = component.get("c.getOutputFields");
        action.setParams({
            "pRecordId": component.get("v.recordId"),
            "pFieldSetName": component.get("v.fieldSetName")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var sectionFields = response.getReturnValue();
                if(!$A.util.isEmpty(sectionFields) && !$A.util.isUndefined(sectionFields)){
                    helper.createSectionBody(component, helper, sectionFields);
                }
            }
        });
        $A.enqueueAction(action);
	},
    createSectionBody : function(component, helper, sectionFields){
        var sectionType = component.get("v.sectionType");
        if (sectionType == "Card"){
            helper.createCardSection(component, sectionFields);
        }
        else {
            helper.createLayoutSection(component, sectionFields);
        }
    },
    createCardSection : function(component, sectionFields) {
        $A.createComponent(
            "c:cardOutputSection",{
                "sectionTitle" : component.get("v.sectionTitle"),
                "sectionFields" : sectionFields,
                "sectionIcon" : component.get("v.sectionIcon"),
                "collapsible" : component.get("v.collapsible"),
                "hiddenByDefault" : component.get("v.hiddenByDefault")
            },
            function(sectionBody, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set("v.body", sectionBody);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );        
	},
    createLayoutSection : function(component, sectionFields) {
        $A.createComponent(
            "c:layoutOutputSection",{
                "sectionTitle" : component.get("v.sectionTitle"),
                "sectionFields" : sectionFields,
                "collapsible" : component.get("v.collapsible")
            },
            function(sectionBody, status, errorMessage){
                if (status === "SUCCESS") {
                    component.set("v.body", sectionBody);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );        
	}
    
})