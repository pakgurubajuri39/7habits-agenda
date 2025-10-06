// Global variables
let currentWeek = new Date();
let userData = {};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    updateWeekDisplay();
    generateWeeklySchedule();
    loadSampleData();
}

function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Login button
    document.getElementById('loginBtn').addEventListener('click', () => {
        document.getElementById('loginModal').style.display = 'block';
    });
    
    // Sharpen the Saw input events
    document.querySelectorAll('.saw-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addSharpenSawItem(this.dataset.dimension, this.value);
                this.value = '';
            }
        });
    });
    
    // Login with Enter key
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
}

// Authentication functions
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            closeModal();
        })
        .catch((error) => {
            alert('Login gagal: ' + error.message);
        });
}

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            closeModal();
        })
        .catch((error) => {
            alert('Pendaftaran gagal: ' + error.message);
        });
}

function logout() {
    auth.signOut();
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Week navigation
function changeWeek(weeks) {
    currentWeek.setDate(currentWeek.getDate() + (weeks * 7));
    updateWeekDisplay();
    generateWeeklySchedule();
    loadUserData();
}

function updateWeekDisplay() {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Start Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentWeek').textContent = 
        `${startOfWeek.toLocaleDateString('id-ID', options)} - ${endOfWeek.toLocaleDateString('id-ID', options)}`;
}

// Weekly schedule generation
function generateWeeklySchedule() {
    const daysContainer = document.querySelector('.days-container');
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const timeSlots = ['06.00-07.00', '07.00-12.00', '12.00-13.00', '13.00-15.00', '15.00-18.00', '18.00-21.00'];
    
    daysContainer.innerHTML = '';
    
    days.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        dayColumn.innerHTML = `<div class="day-header">${day}</div>`;
        
        timeSlots.forEach(timeSlot => {
            const slot = document.createElement('div');
            slot.className = 'day-slot';
            slot.dataset.day = day;
            slot.dataset.time = timeSlot;
            slot.innerHTML = `<div class="scheduled-item" data-slot="${day}-${timeSlot}"></div>`;
            slot.addEventListener('click', () => openSlotEditor(day, timeSlot));
            dayColumn.appendChild(slot);
        });
        
        daysContainer.appendChild(dayColumn);
    });
}

function openSlotEditor(day, time) {
    const activity = prompt(`Aktivitas untuk ${day} ${time}:`, getScheduledActivity(day, time));
    if (activity !== null) {
        scheduleActivity(day, time, activity);
    }
}

function scheduleActivity(day, time, activity) {
    const slot = document.querySelector(`[data-slot="${day}-${time}"]`);
    if (activity.trim()) {
        slot.innerHTML = `<div class="scheduled-activity">${activity}</div>`;
        saveScheduledActivity(day, time, activity);
    } else {
        slot.innerHTML = '';
        saveScheduledActivity(day, time, '');
    }
}

function getScheduledActivity(day, time) {
    return userData.schedule?.[day]?.[time] || '';
}

// Task management
function addNewTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const quadrant = document.getElementById('taskQuadrant').value;
    
    if (title) {
        const task = {
            id: Date.now().toString(),
            title: title,
            quadrant: quadrant,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        addTaskToQuadrant(task);
        saveTask(task);
        document.getElementById('taskTitle').value = '';
    }
}

function addTaskToQuadrant(task) {
    const quadrantElement = document.getElementById(`quadrant${task.quadrant}`);
    const taskElement = document.createElement('div');
    taskElement.className = `task-item quadrant-${task.quadrant}`;
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;
    taskElement.innerHTML = `
        <span>${task.title}</span>
        <button onclick="deleteTask('${task.id}')" class="delete-btn">×</button>
    `;
    
    taskElement.addEventListener('dragstart', drag);
    quadrantElement.appendChild(taskElement);
}

// Drag and drop functionality
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.taskId);
}

function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    const newQuadrant = ev.target.closest('.quadrant').id.replace('quadrant', '');
    
    updateTaskQuadrant(taskId, newQuadrant);
}

function updateTaskQuadrant(taskId, newQuadrant) {
    if (userData.tasks) {
        const taskIndex = userData.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            userData.tasks[taskIndex].quadrant = newQuadrant;
            saveUserData();
            loadTasks();
        }
    }
}

function deleteTask(taskId) {
    if (confirm('Hapus tugas ini?')) {
        if (userData.tasks) {
            userData.tasks = userData.tasks.filter(task => task.id !== taskId);
            saveUserData();
            loadTasks();
        }
    }
}

// Sharpen the Saw functionality
function addSharpenSawItem(dimension, activity) {
    if (activity.trim()) {
        if (!userData.sharpenSaw) userData.sharpenSaw = {};
        if (!userData.sharpenSaw[dimension]) userData.sharpenSaw[dimension] = [];
        
        userData.sharpenSaw[dimension].push({
            id: Date.now().toString(),
            activity: activity,
            completed: false
        });
        
        saveUserData();
        loadSharpenSawItems();
    }
}

function toggleSharpenSawItem(dimension, itemId) {
    const item = userData.sharpenSaw[dimension].find(item => item.id === itemId);
    if (item) {
        item.completed = !item.completed;
        saveUserData();
        loadSharpenSawItems();
    }
}

function deleteSharpenSawItem(dimension, itemId) {
    userData.sharpenSaw[dimension] = userData.sharpenSaw[dimension].filter(item => item.id !== itemId);
    saveUserData();
    loadSharpenSawItems();
}

// Save/Load data functions
function saveMission() {
    const mission = document.getElementById('missionStatement').value;
    userData.mission = mission;
    saveUserData();
    alert('Misi disimpan!');
}

function saveReflection() {
    const reflection = document.getElementById('weeklyReflection').value;
    const weekKey = getWeekKey();
    
    if (!userData.reflections) userData.reflections = {};
    userData.reflections[weekKey] = reflection;
    
    saveUserData();
    alert('Refleksi disimpan!');
}

function saveScheduledActivity(day, time, activity) {
    const weekKey = getWeekKey();
    
    if (!userData.schedule) userData.schedule = {};
    if (!userData.schedule[weekKey]) userData.schedule[weekKey] = {};
    if (!userData.schedule[weekKey][day]) userData.schedule[weekKey][day] = {};
    
    userData.schedule[weekKey][day][time] = activity;
    saveUserData();
}

function saveTask(task) {
    if (!userData.tasks) userData.tasks = [];
    userData.tasks.push(task);
    saveUserData();
}

function saveUserData() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).set(userData, { merge: true })
            .then(() => console.log('Data saved successfully'))
            .catch(error => console.error('Error saving data:', error));
    }
}

function loadUserData() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    userData = doc.data();
                    loadAllData();
                } else {
                    userData = {};
                    loadSampleData();
                }
            })
            .catch(error => console.error('Error loading data:', error));
    }
}

function loadAllData() {
    loadMission();
    loadTasks();
    loadSharpenSawItems();
    loadReflection();
    loadScheduledActivities();
}

function loadMission() {
    if (userData.mission) {
        document.getElementById('missionStatement').value = userData.mission;
    }
}

function loadTasks() {
    // Clear all quadrants
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`quadrant${i}`).innerHTML = '';
    }
    
    // Load tasks
    if (userData.tasks) {
        userData.tasks.forEach(task => {
            addTaskToQuadrant(task);
        });
    }
}

function loadSharpenSawItems() {
    const dimensions = ['physical', 'spiritual', 'intellectual', 'social'];
    
    dimensions.forEach(dimension => {
        const listElement = document.getElementById(`${dimension}List`);
        listElement.innerHTML = '';
        
        if (userData.sharpenSaw && userData.sharpenSaw[dimension]) {
            userData.sharpenSaw[dimension].forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = `saw-item ${item.completed ? 'completed' : ''}`;
                itemElement.innerHTML = `
                    <span onclick="toggleSharpenSawItem('${dimension}', '${item.id}')" 
                          style="cursor: pointer; flex: 1; text-decoration: ${item.completed ? 'line-through' : 'none'}">
                        ${item.activity}
                    </span>
                    <button onclick="deleteSharpenSawItem('${dimension}', '${item.id}')" class="delete-btn">×</button>
                `;
                listElement.appendChild(itemElement);
            });
        }
    });
}

function loadReflection() {
    const weekKey = getWeekKey();
    if (userData.reflections && userData.reflections[weekKey]) {
        document.getElementById('weeklyReflection').value = userData.reflections[weekKey];
    }
}

function loadScheduledActivities() {
    const weekKey = getWeekKey();
    if (userData.schedule && userData.schedule[weekKey]) {
        const weeklySchedule = userData.schedule[weekKey];
        
        Object.keys(weeklySchedule).forEach(day => {
            Object.keys(weeklySchedule[day]).forEach(time => {
                const activity = weeklySchedule[day][time];
                if (activity) {
                    const slot = document.querySelector(`[data-slot="${day}-${time}"]`);
                    if (slot) {
                        slot.innerHTML = `<div class="scheduled-activity">${activity}</div>`;
                    }
                }
            });
        });
    }
}

// Utility functions
function getWeekKey() {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    return startOfWeek.toISOString().split('T')[0];
}

function loadSampleData() {
    // Load sample data only if no user data exists
    if (!userData.mission) {
        document.getElementById('missionStatement').value = "Misi saya adalah menciptakan lingkungan belajar yang inklusif dan inspiratif bagi setiap siswa, sambil menjaga keseimbangan antara kehidupan profesional dan pribadi.";
    }
    
    // Add sample tasks if no tasks exist
    if (!userData.tasks || userData.tasks.length === 0) {
        const sampleTasks = [
            { id: '1', title: 'Menyusun RPP proyek minggu depan', quadrant: '2', completed: false, createdAt: new Date().toISOString() },
            { id: '2', title: 'Koreksi ulangan harian', quadrant: '1', completed: false, createdAt: new Date().toISOString() },
            { id: '3', title: 'Rapat koordinasi mingguan', quadrant: '3', completed: false, createdAt: new Date().toISOString() },
            { id: '4', title: 'Baca buku pengembangan diri', quadrant: '2', completed: false, createdAt: new Date().toISOString() }
        ];
        
        sampleTasks.forEach(task => addTaskToQuadrant(task));
        userData.tasks = sampleTasks;
    }
}

// Add some CSS for delete buttons
const style = document.createElement('style');
style.textContent = `
    .delete-btn {
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        font-size: 12px;
        margin-left: 8px;
    }
    
    .delete-btn:hover {
        background: #c0392b;
    }
    
    .saw-item.completed {
        opacity: 0.6;
    }
    
    .scheduled-activity {
        background: white;
        padding: 5px;
        border-radius: 3px;
        font-size: 0.8em;
        border-left: 2px solid #3498db;
    }
`;
document.head.appendChild(style);
