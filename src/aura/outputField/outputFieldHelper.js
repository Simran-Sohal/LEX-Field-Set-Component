/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - outputFieldHelper.js
 *
 * Developer(s) - SSingh
 *
 */
({
	getUIComponentType : function(fieldType) {
        var uiComponentType = "ui:outputText";
        
        if (fieldType == "BOOLEAN"){
            uiComponentType = "ui:outputCheckbox";
        } 
        else if (fieldType == "CURRENCY"){
            uiComponentType = "ui:outputCurrency";
        } 
        else if (fieldType == "DATE"){
            uiComponentType = "ui:outputDate";
        }
        else if (fieldType == "DATETIME"){
            uiComponentType = "ui:outputDateTime";
        }
        else if (fieldType == "DOUBLE"){
            uiComponentType = "ui:outputNumber";
        } 
        else if (fieldType == "EMAIL"){
            uiComponentType = "ui:outputEmail";
        } 
        else if (fieldType == "INTEGER"){
            uiComponentType = "ui:outputNumber";
        } 
        else if (fieldType == "PERCENT"){
            uiComponentType = "ui:outputNumber";
        } 
        else if (fieldType == "PHONE"){
            uiComponentType = "ui:outputPhone";
        } 
        else if (fieldType == "TEXTAREA"){
            uiComponentType = "ui:outputTextArea";
        } 
        else if (fieldType == "URL"){
            uiComponentType = "ui:outputURL";
        }
        else if (fieldType == "REFERENCE"){
            uiComponentType = "c:referenceField";
        }
        else {
            uiComponentType = "ui:outputText";
        }
        
        return uiComponentType;
	},
    
    createField : function(component, event, helper, uiComponentType){
        $A.createComponent(
            uiComponentType,
            {
                "value": component.get("v.value"),
                "class": component.get("v.class")
            },
            function(uiComponent, status, errorMessage){
                if (status === "SUCCESS") {
                    helper.setFieldBody(component, uiComponent);
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

    createURLField : function(component, event, helper){
        var urlLabel = component.get("v.label");
        if (urlLabel == null || urlLabel == undefined || urlLabel == ""){
            urlLabel = component.get("v.value");
        }
        
        $A.createComponent(
            "ui:outputURL",
            {
                "value": component.get("v.value"),
                "label": urlLabel,
                "class": component.get("v.class")
            },
            function(urlField, status, errorMessage){
                if (status === "SUCCESS") {
                    helper.setFieldBody(component, urlField);
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

    createReferenceField : function(component, event, helper){
        var fieldLabel = component.get("v.label");
        if (fieldLabel == null || fieldLabel == undefined || fieldLabel == ""){
            fieldLabel = component.get("v.value");
        }
        
        $A.createComponent(
            "c:referenceField",
            {
                "referenceRecordId": component.get("v.value"),
                "referenceRecordName": fieldLabel,
                "class": component.get("v.class")
            },
            function(refField, status, errorMessage){
                if (status === "SUCCESS") {
                    helper.setFieldBody(component, refField);
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
    
    setFieldBody : function(component, createdField){
        var componentBody = component.get("v.body");
        componentBody.push(createdField);
        component.set("v.body", componentBody);
    }
})