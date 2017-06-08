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
        
        if (fieldType == "BOOLEAN" || fieldType == ""){
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
        else {
            uiComponentType = "ui:outputText";
        }
        
        return uiComponentType;
	}
})