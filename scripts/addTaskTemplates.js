function getAssignedToContactTemplate(name, initials, index, bgClass) {
    return`
            <div id="addTask_assignedTo_contact_${index}" class="dropDownContacts contactUnchecked" onclick="addTaskselectContactToAssignTask(event, ${index})">
                <div class="dropDownContact">
                    <div class="contactCircleSmallDetailView ${bgClass}">${initials}</div>
                    <p>${name}</p>
                </div>
                <div class="editDialogBoardAssignedToDropDownCheckbox contactUncheckedCheckbox">
                </div>
            </div>
    `
}

function getAssignedToContactIconTemplate(initials, index, bgClass) {
    return`
            <div id="addTask_assignedTo_contactIcon_${index}" class="contactCircleSmallDetailView ${bgClass} d_none">${initials}</div>
    `
}