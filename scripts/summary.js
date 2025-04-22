function initSummary() {
    init();
    loadNumberOfTasks();
    greeting();
}


//Hover effect pencil
function changeImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_lightgrey.svg';
}


function resetImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_grey.svg';
}


function switchToBoard() {
    window.location.href = '../html/board.html';
}


//greeting 
function greeting() {
    let d = new Date();
    let hour = d.getHours();
    let greetingMessage = "Good " + (hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening");
    getCurrentUserFromLocalStorage();
    if (currentUserName === "Guest") {
        document.getElementById("summary_greeting_text").innerHTML = greetingMessage;

    } else {
        document.getElementById("summary_greeting_text").innerHTML = greetingMessage + ",";
        document.getElementById("summary_greeting_name").innerHTML = currentUserName;
    }
}


//Filter tasks for summary
function loadNumberOfTasksWithStatus(tasks, status) {
    let filteredTasks = tasks.filter(task => task.status === status);
    return filteredTasks.length;
}


function loadNumberOfTasksWithPriority(tasks, priority) {
    let filteredTasks = tasks.filter(task => task.priority === priority);
    return filteredTasks.length;
}


//find next deadline
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


//format the deadline
function formatDate(deadline) {
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return deadline.toLocaleDateString('en-US', options);
}


//load tasks for summary
async function loadNumberOfTasks() {
    let tasks = await getAllTasks();
    let tasksArray = Object.values(tasks);
    document.getElementById("summary_number_of_to_do_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'toDoTask');
    document.getElementById("summary_number_of_in_progress_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'inProgressTask');
    document.getElementById("summary_number_of_done_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'doneTask');
    document.getElementById("summary_number_of_await_feedback_tasks").innerHTML = loadNumberOfTasksWithStatus(tasksArray, 'awaitFeedbackTask');
    document.getElementById("summary_number_of_urgent_tasks").innerHTML = loadNumberOfTasksWithPriority(tasksArray, 'urgent');
    document.getElementById("summary_number_of_tasks_in_board").innerHTML = sumOfOpenTasks(tasksArray); 
    document.getElementById("summary_next_deadline").innerHTML = findNextDeadline(tasksArray) ? formatDate(findNextDeadline(tasksArray)) : "No deadline set";
}


//Sum of all open tasks
function sumOfOpenTasks(tasksArray) {
    let toDoTasks = loadNumberOfTasksWithStatus(tasksArray, 'toDoTask');
    let inProgressTasks = loadNumberOfTasksWithStatus(tasksArray, 'inProgressTask');
    let awaitFeedbackTasks = loadNumberOfTasksWithStatus(tasksArray, 'awaitFeedbackTask');
    let sum = toDoTasks + inProgressTasks + awaitFeedbackTasks;
    return sum;
}