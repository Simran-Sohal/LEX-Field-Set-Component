({
    navigateToReferenceRecord : function(component, event, helper) {
        var selectedRecord = event.currentTarget;
        var referenceRecordId = selectedRecord.dataset.record;
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": referenceRecordId
        });
        navEvt.fire();
    }
})