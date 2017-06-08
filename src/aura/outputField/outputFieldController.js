/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - outputFieldController.js
 *
 * Developer(s) - SSingh
 *
 */
({
	doInit : function(component, event, helper) {
		//get the appropriate ui component for the field type
        var uiComponentType = helper.getUIComponentType(component.get("v.fieldType"));
        //console.log("Component Type : " + uiComponentType);
        
        //create the component dynamically
        $A.createComponent(
            uiComponentType,
            {
                "value": component.get("v.fieldValue"),
                "class": component.get("v.styleClass")
            },
            function(uiComponent, status, errorMessage){
                if (status === "SUCCESS") {
                    var componentBody = component.get("v.body");
                    componentBody.push(uiComponent);
                    component.set("v.body", componentBody);
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