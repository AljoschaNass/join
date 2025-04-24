async function searchTask() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    let allTasks = await getAllTasks();
    let allTasksArray = Object.values(allTasks);
    let filteredTasks = allTasksArray.filter(task => task.title.toLowerCase().includes(searchInput) || task.description.toLowerCase().includes(searchInput));
    console.log(filteredTasks);
}