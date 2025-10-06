// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASpHaRhfJFUyhC3Osj24CTgU06Vsz10x0",
  authDomain: "habits-agenda.firebaseapp.com",
  projectId: "habits-agenda",
  storageBucket: "habits-agenda.firebasestorage.app",
  messagingSenderId: "1068837152911",
  appId: "1:1068837152911:web:85111cd637f0840e4668fa",
  measurementId: "G-LQZP1GL06X"
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
