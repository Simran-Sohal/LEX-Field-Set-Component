/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * File Name    - outputDataRowController.js
 *
 * Developer(s) - SSingh
 *
 */
({
	navigateToRecord : function(component, event, helper) {
         var selectedRecord = event.currentTarget;
         var targetRecordId = selectedRecord.dataset.record;
         var navEvt = $A.get("e.force:navigateToSObject");
         navEvt.setParams({
             "recordId": targetRecordId
         });
         navEvt.fire();
   	}
})