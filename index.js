const fs = require('fs').promises;
const readline = require('readline-sync');

// Function to get all tasks
async function getAllTasks() {
  try {
    const data = await fs.readFile('tasks.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks:", error);
    return [];
  }
}

// Function to list all tasks
async function listTasks() {
  const tasks = await getAllTasks();
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.title} - ${task.status}`);
  });
}

// Function to add a new task
async function addTask(title, description) {
  const tasks = await getAllTasks();
  const newTask = { title, description, status: "not completed" };
  tasks.push(newTask);
  await saveTasks(tasks);
  console.log(`Task "${title}" has been added successfully.`);
}

// Function to mark a task as completed
async function completeTask(title) {
  const tasks = await getAllTasks();
  const taskIndex = tasks.findIndex(task => task.title === title);

  if (taskIndex !== -1) {
    tasks[taskIndex].status = "completed";
    await saveTasks(tasks);
    console.log(`Task "${title}" marked as completed.`);
  } else {
    console.log(`Task "${title}" not found.`);
  }
}

// Function to save tasks to tasks.json
async function saveTasks(tasks) {
  try {
    await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

// Function to display the menu and get user input
function showMenu() {
  console.log("\nTask Manager:");
  console.log("1. List all tasks");
  console.log("2. Add a new task");
  console.log("3. Mark a task as completed");
  console.log("4. Exit");
}

// Main function to handle user interaction
async function main() {
  let exit = false;
  while (!exit) {
    showMenu();
    const choice = readline.question("Choose an option: ");
    console.log("");

    switch (choice) {
      case '1':
        await listTasks();
        break;
      case '2':
        const title = readline.question("Enter task title: ");
        const description = readline.question("Enter task description: ");
        await addTask(title, description);
        break;
      case '3':
        const taskToComplete = readline.question("Enter task title to mark as completed: ");
        await completeTask(taskToComplete);
        break;
      case '4':
        exit = true;
        console.log("Goodbye!");
        break;
      default:
        console.log("Invalid option, please try again.");
    }
    console.log("");
  }
}

main();
