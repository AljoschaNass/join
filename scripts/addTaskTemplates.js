function getAssignedToContactTemplate(name, initials, index) {
    return`
            <div id="addTask_assignedTo_contact_${index}" class="dropDownContacts contactUnchecked" onclick="addTaskselectContactToAssignTask(event, ${index})">
                <div class="dropDownContact">
                    <div class="contactCircleSmallDetailView backgroundColorOrange">${initials}</div>
                    <p>${name}</p>
                </div>
                <div class="editDialogBoardAssignedToDropDownCheckbox contactUncheckedCheckbox">
                </div>
            </div>
    `
}

function getAssignedToContactIconTemplate(initials, index) {
    return`
            <div id="addTask_assignedTo_contactIcon_${index}" class="contactCircleSmallDetailView backgroundColorGreen d_none">${initials}</div>
    `
}