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
