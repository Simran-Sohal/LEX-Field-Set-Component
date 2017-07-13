/** 
 * Copyright (c) 2017 Simranjeet Singh
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
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
        else if (fieldType == "REFERENCE"){
            uiComponentType = "c:referenceField";
        }
        else {
            uiComponentType = "ui:outputText";
        }
        
        return uiComponentType;
	},
    
    createField : function(component, event, uiComponentType){
        $A.createComponent(
            uiComponentType,
            {
                "value": component.get("v.value"),
                "class": component.get("v.class")
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
    },

    createURLField : function(component, event){
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
                    var componentBody = component.get("v.body");
                    componentBody.push(urlField);
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
    },

    createReferenceField : function(component, event){
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
                    var componentBody = component.get("v.body");
                    componentBody.push(refField);
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
