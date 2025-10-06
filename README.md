# 7 Habits Agenda - Aplikasi untuk Guru

Aplikasi web progresif untuk membantu guru menerapkan 7 Habits dalam pengaturan jadwal dan agenda.

## Fitur Utama

- ✅ **Mission Statement** (Habit 2)
- ✅ **Priority Matrix** (Habit 3) dengan drag & drop
- ✅ **Weekly Schedule** dengan jadwal mengajar tetap
- ✅ **Sharpen the Saw** tracker (Habit 7)
- ✅ **Weekly Reflection** (Habit 1 & 5)
- ✅ **Cloud Sync** dengan Firebase
- ✅ **Responsive Design**

## Setup Firebase

1. Buat project baru di [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Ganti config di `js/firebase-config.js` dengan config project Anda

## Deploy ke GitHub Pages

1. Push code ke repository GitHub
2. Go to Settings → Pages
3. Pilih source: GitHub Actions
4. Aplikasi akan tersedia di `https://username.github.io/repository-name`

## Penggunaan

1. **Login/Daftar** dengan email dan password
2. **Tulis Mission Statement** di bagian atas
3. **Atur Prioritas** menggunakan matriks Eisenhower
4. **Jadwalkan aktivitas** di kalender mingguan
5. **Track Sharpen the Saw** activities
6. **Tulis refleksi** mingguan
7. Semua data otomatis tersimpan di cloud

## Teknologi

- HTML5, CSS3, JavaScript
- Firebase (Auth & Firestore)
- PWA Capabilities
- Drag & Drop API
- Responsive Grid Layout
