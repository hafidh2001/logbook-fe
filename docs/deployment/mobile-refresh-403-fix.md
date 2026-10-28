# Fix refresh /mobile dan /mobile/ menjadi 403

Perubahan aktif di source:
C:\Data\code\logbook-fe\nginx.conf

## Penyebab

public/mobile disalin Vite menjadi dist/mobile. Folder ini berisi SVG, bukan index.html. Pada konfigurasi lama, try_files $uri $uri/ /index.html menemukan folder tersebut dan berhenti sebelum SPA fallback: /mobile mengembalikan redirect301 ke /mobile/, lalu /mobile/ mengembalikan403.

## Perbaikan

Dua exact-match location ditambahkan di server block:

    location = /mobile {
        rewrite ^ /index.html last;
    }
    location = /mobile/ {
        rewrite ^ /index.html last;
    }

Ini adalah rewrite internal, bukan redirect browser. Respons masuk ke location index.html yang sudah memiliki Cache-Control no-store. Regex static assets dan fallback route lain tetap digunakan. Jangan menambahkan autoindex on, chmod777, atau mengubah API/proxy untuk menyelesaikan masalah ini.

## Deploy Docker Compose

Dari direktori project pada host deployment, jalankan:

    docker compose up -d --build app
    docker compose exec app nginx -t

Dockerfile sudah menyalin nginx.conf ke /etc/nginx/conf.d/default.conf. Rebuild/recreate app diperlukan supaya konfigurasi baru masuk ke image/container. Perintah tersebut belum dijalankan ke deployment oleh agen. Bila pipeline memakai image registry, build/push image lalu redeploy melalui pipeline yang digunakan.

## Jika deploy hanya dist atau memakai Nginx eksternal

Mengunggah dist saja TIDAK memasang konfigurasi Nginx. Tambahkan dua location tersebut ke server block yang benar-benar melayani medlink-dev.kelava.id, validasi dengan nginx -t, lalu reload Nginx sesuai cara pengelolaan server. Jika Nginx depan melayani folder langsung sebelum meneruskan ke container, aturan di Nginx depan juga perlu diperiksa.

## Verifikasi lokal

    python scripts/test-mobile-spa-nginx.py

Menggunakan Nginx nyata lokal, port loopback acak dan hasil build dist, bukan mock. Sebelum perbaikan: /mobile301 dan /mobile/403 direproduksi. Sesudah perbaikan: 13 kasus lulus, meliputi /mobile, /mobile/, querystring, nested routes, login/admin, empat aset SVG aktual dan missing-asset404. index.html tidak di-cache dan aset tetap mengirim byte SVG asli. Syntax Nginx lulus. Test hanya mengganti listen port/root path agar terisolasi; aturan location dari nginx.conf dipakai langsung.

Bukti:
C:\Data\code\logbook-fe\docs\deployment\mobile-refresh-nginx.before.json
C:\Data\code\logbook-fe\docs\deployment\mobile-refresh-nginx.verification.json

Belum diuji pada konfigurasi Nginx server aktif. Tidak ada akses produksi/API/database dan tidak ada perubahan dist, akun, CORS, atau transport API.
