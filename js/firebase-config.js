// Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Firebase Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        document.getElementById('userEmail').textContent = user.email;
        loadUserData();
    } else {
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('userEmail').textContent = '';
        document.getElementById('loginModal').style.display = 'block';
    }
});
