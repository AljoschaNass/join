function getAssignedToContactTemplate(name, initials, index) {
    return`
            <div id="addTask_assignedTo_contact_${index}" class="dropDownContacts contactUnchecked" onclick="selectContactToAssignTask(event)">
                <div class="dropDownContact">
                    <div class="contactCircleSmallDetailView backgroundColorOrange">${initials}</div>
                    <p>${name}</p>
                </div>
                <div class="editDialogBoardAssignedToDropDownCheckbox contactUncheckedCheckbox">
                </div>
            </div>
    `
}