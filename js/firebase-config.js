// Firebase configuration - GANTI DENGAN CONFIG ANDA SENDIRI
const firebaseConfig = {
    apiKey: "AIzaSyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:aaaaaaaaaaaaaaaaaaaaaa"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Firebase Auth state listener
auth.onAuthStateChanged((user) => {
    console.log("Auth state changed:", user);
    if (user) {
        // User is signed in
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('loginModal').style.display = 'none';
        loadUserData();
    } else {
        // User is signed out
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('userEmail').textContent = '';
        // Jangan auto-show modal, biarkan user klik login
    }
});

// Function to show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// Function to close login modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}
