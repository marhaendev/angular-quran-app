# Quran App (Angular 17+)

Aplikasi Al-Quran Digital modern yang dibangun menggunakan Angular, dengan desain premium "Serene Emerald" dan fitur lengkap untuk pengalaman membaca yang nyaman.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Angular](https://img.shields.io/badge/Angular-17%2B-dd0031.svg) ![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed.svg)

## ✨ Fitur Utama

*   **List Surah Lengkap**: Menampilkan 114 surah dengan navigasi responsif.
*   **Desain Premium**: Tema "Serene Emerald" dengan tipografi Arab (Amiri) dan Latin (Inter/Outfit) yang elegan.
*   **Detail Surah & Ayat**: Tampilan ayat yang jelas dengan terjemahan Bahasa Indonesia.
*   **Audio Playback**: Pemutar audio murottal per ayat.
*   **Pencarian Cepat**: Filter surah secara instan (sudah disederhanakan).
*   **Mode Gelap/Terang**: (Coming soon/Planned)
*   **Responsive Mobile**: Dioptimalkan untuk layar HP dengan bottom navigation bar.
*   **Scroller Tooltip**: Navigasi cepat dengan tooltip indikator nomor surah/ayat.

## 🛠️ Teknologi

*   **Frontend**: Angular 17+ (Standalone Components)
*   **Styling**: SCSS (Custom Design System, No CSS Framework dependence)
*   **State Management**: RxJS (Reactive)
*   **API**: <a href="https://equran.id/apidev/v2" target="_blank">Quran API V2</a> (Public API)
*   **Deployment**: Docker & Nginx

## 🚀 Cara Menjalankan

### Persyaratan

*   Node.js v18+ (untuk development)
*   Docker Desktop (untuk containerization)

### Opsi 1: Menggunakan Docker (Rekomendasi)

1.  **Clone repository**
    
    ```bash
    git clone https://github.com/marhaendev/angular-quran-app.git
    cd quran-app
    ```
    
2.  **Buat file environment** Salin file contoh env:
    
    ```bash
    cp .env.example .env
    ```
    
3.  **Jalankan dengan Docker Compose**
    
    ```bash
    docker-compose up -d --build
    ```
    
4.  **Buka Aplikasi** Akses di browser: `http://localhost:4200`
    

### Opsi 2: Development Manual (Tanpa Docker)

1.  **Install Dependencies**
    
    ```bash
    npm install
    ```
    
2.  **Jalankan Development Server**
    
    ```bash
    npm start
    ```
    
    Aplikasi akan berjalan di `http://localhost:4200`.
    

## 📂 Struktur Project

```
quran-app/
├── src/
│   ├── app/
│   │   ├── core/                 # Service & Logic global
│   │   ├── features/             
│   │   │   ├── surah-list/       # Halaman depan & list surah
│   │   │   └── surah-detail/     # Halaman baca surah
│   │   ├── shared/               # Komponen reusable (Loading, Error)
│   │   └── ...
│   ├── assets/                   # Images, Icons, Fonts
│   └── styles.scss               # Global styles & variables
├── docker-compose.yml            # Konfigurasi Docker
├── .env.example                  # Template environment variables
└── README.md                     # Dokumentasi ini
```

## 🎨 Kredit & Desain

Developed by **<a href="https://hasanaskari.com" target="_blank">hasanaskari.com</a>**

*   **Konsep Desain**: Modern Islamic Interface
*   **Warna Utama**: Deep Emerald (`#1B5E20`) & Soft Gold (`#C5A059`)
*   **Font**: Amiri (Arab), Inter (UI)

* * *

_Dibuat untuk tujuan pembelajaran._
