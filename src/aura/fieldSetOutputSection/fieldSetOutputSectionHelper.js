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
                "hiddenByDefault" : component.get("v.hiddenByDefault"),
                "columnClass" : helper.getColumnClass(component.get("v.columnsPerRow"))
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
                "collapsible" : component.get("v.collapsible"),
                "columnClass" : helper.getColumnClass(component.get("v.columnsPerRow"))
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
    getColumnClass : function(numberOfColumns){
        var columnClass = "slds-large-size_1-of-2"; //default 2 fields per row
        
        if (numberOfColumns == "1"){
            columnClass = "slds-large-size_1-of-1";
        } else if (numberOfColumns == "2"){
            columnClass = "slds-large-size_1-of-2";
        } else if (numberOfColumns == "3"){
            columnClass = "slds-large-size_1-of-3";
        } else if (numberOfColumns == "4"){
            columnClass = "slds-large-size_1-of-4";
        }
        
        return columnClass;
    }
    
})
