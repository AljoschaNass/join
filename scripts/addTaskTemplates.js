function getAssignedToContactTemplate(name) {
    return`
            <div class="dropDownContacts contactUnchecked" onclick="selectContactToAssignTask(event)">
                <div class="dropDownContact">
                    <div class="contactCircleSmallDetailView backgroundColorOrange">AM</div>
                    <p>${name}</p>
                </div>
                <div class="editDialogBoardAssignedToDropDownCheckbox contactUncheckedCheckbox">
                </div>
            </div>
    `
}