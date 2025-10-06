// Improved Authentication Functions
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('authMessage');

    if (!email || !password) {
        showAuthMessage('Harap isi email dan password', 'error');
        return;
    }

    try {
        showAuthMessage('Sedang login...', 'info');
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showAuthMessage('Login berhasil!', 'success');
        closeLoginModal();
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login gagal: ';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'Email tidak terdaftar';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Password salah';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Format email tidak valid';
                break;
            default:
                errorMessage += error.message;
        }
        showAuthMessage(errorMessage, 'error');
    }
}

async function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('authMessage');

    if (!email || !password) {
        showAuthMessage('Harap isi email dan password', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password harus minimal 6 karakter', 'error');
        return;
    }

    try {
        showAuthMessage('Mendaftarkan akun...', 'info');
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        showAuthMessage('Pendaftaran berhasil! Anda sudah login.', 'success');
        
        // Create initial user data structure
        const user = userCredential.user;
        const initialUserData = {
            email: user.email,
            mission: "Misi saya adalah menciptakan lingkungan belajar yang inklusif dan inspiratif bagi setiap siswa, sambil menjaga keseimbangan antara kehidupan profesional dan pribadi.",
            tasks: [],
            sharpenSaw: {},
            reflections: {},
            schedule: {},
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('users').doc(user.uid).set(initialUserData);
        closeLoginModal();
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Pendaftaran gagal: ';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email sudah digunakan';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password terlalu lemah';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Format email tidak valid';
                break;
            default:
                errorMessage += error.message;
        }
        showAuthMessage(errorMessage, 'error');
    }
}

function showAuthMessage(message, type) {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    
    // Auto hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'auth-message';
        }, 3000);
    }
}

function logout() {
    if (confirm('Yakin ingin logout?')) {
        auth.signOut().then(() => {
            console.log('User signed out successfully');
            // Reset UI to initial state
            resetUI();
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    }
}

function resetUI() {
    // Clear all data displays
    document.getElementById('missionStatement').value = '';
    document.getElementById('weeklyReflection').value = '';
    
    // Clear task quadrants
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`quadrant${i}`).innerHTML = '';
    }
    
    // Clear sharpen the saw
    const dimensions = ['physical', 'spiritual', 'intellectual', 'social'];
    dimensions.forEach(dim => {
        document.getElementById(`${dim}List`).innerHTML = '';
    });
    
    // Clear schedule
    document.querySelectorAll('.scheduled-activity').forEach(item => {
        item.innerHTML = '';
    });
}
