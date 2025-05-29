/**
 * Initializes the summary by calling necessary functions to set up the UI.
 */
function initSummary() {
    init();
    loadNumberOfTasks();
    loadNextDeadline();
    greeting();
    checkScreenWidth();
    checkUserLogIn();
}


/**
 * Changes the image source of the specified element to a light grey pencil icon.
 * @param {HTMLElement} element - The element containing the image to change.
 */
function changeImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_lightgrey.svg';
}


/**
 * Resets the image source of the specified element to a grey pencil icon.
 * @param {HTMLElement} element - The element containing the image to reset.
 */
function resetImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_grey.svg';
}


/**
 * Redirects the user to the board page.
 */
function switchToBoard() {
    window.location.href = '../html/board.html';
}


/**
 * Displays a greeting message based on the current time and the user's name.
 * If the user is a guest and the screen width is less than 1024 pixels, 
 * the greeting message will include an exclamation mark. 
 * If the user is registered, their name will be displayed alongside the greeting.
 * 
 * @returns {void} This function does not return a value.
 */
function greeting() {
    let d = new Date();
    let hour = d.getHours();
    let greetingMessage = "Good " + (hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening");
    getCurrentUserFromLocalStorage();
    let greeting = currentUserName === "Guest" ? (window.innerWidth < 1025 ? greetingMessage + "!" : greetingMessage) : greetingMessage + ",";
    document.getElementById("summary_greeting_text").innerHTML = greeting;
    if (currentUserName !== "Guest") document.getElementById("summary_greeting_name").innerHTML = currentUserName;
}


/**
 * Loads the number of tasks with a specific status.
 * @param {Array} tasks - The array of tasks to filter.
 * @param {string} status - The status to filter tasks by.
 * @returns {number} The number of tasks with the specified status.
 */
function loadNumberOfTasksWithStatus(tasks, status) {
    let filteredTasks = tasks.filter(task => task.status === status);
    return filteredTasks.length;
}


/**
 * Loads the number of tasks with a specific priority.
 * @param {Array} tasks - The array of tasks to filter.
 * @param {string} priority - The priority to filter tasks by.
 * @returns {number} The number of tasks with the specified priority.
 */
function loadNumberOfTasksWithPriority(tasks, priority) {
    let filteredTasks = tasks.filter(task => task.priority === priority);
    return filteredTasks.length;
}


/**
 * Finds the next deadline from an array of tasks.
 * @param {Array} tasks - The array of tasks to search for deadlines.
 * @returns {Date|null} The next deadline date or null if no deadlines are found.
 */
function findNextDeadline(tasks) {
    let nextDeadline = null;
    tasks.forEach(task => {
        if (task.dueDate) {
            let taskDate = new Date(task.dueDate);
            if (!nextDeadline || taskDate < nextDeadline) {
                nextDeadline = taskDate;
            }
        }
    });
    return nextDeadline;
}


/**
 * Formats a deadline date into a readable string.
 * @param {Date} deadline - The deadline date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(deadline) {
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return deadline.toLocaleDateString('en-US', options);
}


/**
 * Loads the number of tasks and updates the summary UI.
 * @returns {Promise<void>} A promise that resolves when the tasks are loaded and the UI is updated.
 */
async function loadNumberOfTasks() {
    let tasks = await getAllTasks();
    let tasksArray = Object.values(tasks);
    document.getElementById("summary_number_of_to_do_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'toDoTask');
    document.getElementById("summary_number_of_in_progress_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'inProgressTask');
    document.getElementById("summary_number_of_done_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'doneTask');
    document.getElementById("summary_number_of_await_feedback_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'awaitFeedbackTask');
    document.getElementById("summary_number_of_urgent_tasks").innerHTML = loadNumberOfTasksWithPriority(tasksArray, 'urgent');
    document.getElementById("summary_number_of_tasks_in_board").innerHTML = sumOfOpenTasks(tasksArray); 
}


/**
 * Sums the number of open tasks from the provided tasks array.
 * @param {Array} tasksArray - The array of tasks to sum.
 * @returns {number} The total number of open tasks (to-do, in progress and awaiting feedback).
 */
function sumOfOpenTasks(tasksArray) {
    let toDoTasks = loadNumberOfTasksWithStatus(tasksArray, 'toDoTask');
    let inProgressTasks = loadNumberOfTasksWithStatus(tasksArray, 'inProgressTask');
    let awaitFeedbackTasks = loadNumberOfTasksWithStatus(tasksArray, 'awaitFeedbackTask');
    let sum = toDoTasks + inProgressTasks + awaitFeedbackTasks;
    return sum;
}


/**
 * Loads the next deadline and updates the summary UI.
 * @returns {Promise<void>} A promise that resolves when the next deadline is loaded and the UI is updated.
 */
async function loadNextDeadline() {
    let tasks = await getAllTasks();
    let tasksArray = Object.values(tasks);
    document.getElementById("summary_next_deadline").innerHTML = findNextDeadline(tasksArray) ? formatDate(findNextDeadline(tasksArray)) : "No deadline set";
}


/**
 * Displays the summary section by hiding the greeting and showing the summary elements.
 *
 * @returns {void} This function does not return a value.
 */
function showSummary() {
    let summaryGreeting = document.getElementById('summary_greeting');
    let headSummaryPositionResp = document.getElementById('headSummaryPositionResp');
    let summaryCards = document.getElementById('summary_cards');
    setTimeout(() => {
        summaryGreeting.style.display = 'none'; 
        headSummaryPositionResp.style.display = 'flex'; 
        summaryCards.style.display = 'flex';
    }, 1000); 
}


/**
 * Checks the current width of the browser window and displays the summary section after hiding the greeting
 * if the width is less than 1024 pixels.
 * 
 * If the window width is less than 1024 pixels, the function calls 
 * the `showSummary` function to display the summary section. 
 * If the width is 1024 pixels or greater, it hides the responsive 
 * summary header by setting its display to 'none'.
 * 
 * @returns {void} This function does not return a value.
 */
function checkScreenWidth() {
    if (window.innerWidth < 1025) {
        showSummary();
    } else {
        let headSummaryPositionResp = document.getElementById('headSummaryPositionResp');
        headSummaryPositionResp.style.display = 'none'; 
    }
}


