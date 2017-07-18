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
        var uiComponentType = helper.getUIComponentType(component.get("v.type"));
        //console.log("Component Type : " + uiComponentType);
        
        if (uiComponentType == "ui:outputURL"){
            helper.createURLField(component, event, helper);
        }
        else if (uiComponentType == "c:referenceField"){
            helper.createReferenceField(component, event, helper);
        }
        else {
            helper.createField(component, event, helper, uiComponentType);
        }
    }
    
})