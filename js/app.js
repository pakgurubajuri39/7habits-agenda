// Fix untuk generate weekly schedule yang benar
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
            
            // Cek apakah ada aktivitas yang sudah dijadwalkan
            const existingActivity = getScheduledActivity(day, timeSlot);
            if (existingActivity) {
                slot.innerHTML = `<div class="scheduled-activity">${existingActivity}</div>`;
            } else {
                slot.innerHTML = '<div class="scheduled-activity"></div>';
            }
            
            slot.addEventListener('click', () => openSlotEditor(day, timeSlot));
            dayColumn.appendChild(slot);
        });
        
        daysContainer.appendChild(dayColumn);
    });
}

// Fix untuk save scheduled activity
function saveScheduledActivity(day, time, activity) {
    const weekKey = getWeekKey();
    
    if (!userData.schedule) userData.schedule = {};
    if (!userData.schedule[weekKey]) userData.schedule[weekKey] = {};
    if (!userData.schedule[weekKey][day]) userData.schedule[weekKey][day] = {};
    
    userData.schedule[weekKey][day][time] = activity;
    saveUserData();
}

// Fix function untuk mendapatkan aktivitas yang dijadwalkan
function getScheduledActivity(day, time) {
    const weekKey = getWeekKey();
    return userData.schedule?.[weekKey]?.[day]?.[time] || '';
}

// Fix untuk load sample data yang benar
function loadSampleData() {
    // Only load sample data if no user data exists and user is not logged in
    if (auth.currentUser) return;
    
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
    
    // Add sample sharpen the saw items
    if (!userData.sharpenSaw) {
        userData.sharpenSaw = {
            physical: [
                { id: '1', activity: 'Olahraga pagi 30 menit', completed: false },
                { id: '2', activity: 'Jalan santai sore', completed: false }
            ],
            spiritual: [
                { id: '1', activity: 'Meditasi 10 menit', completed: false },
                { id: '2', activity: 'Membaca buku inspiratif', completed: false }
            ],
            intellectual: [
                { id: '1', activity: 'Baca artikel pendidikan', completed: false },
                { id: '2', activity: 'Ikuti webinar guru', completed: false }
            ],
            social: [
                { id: '1', activity: 'Quality time dengan keluarga', completed: false },
                { id: '2', activity: 'Telepon teman lama', completed: false }
            ]
        };
        loadSharpenSawItems();
    }
}
