/* =========================================================
   PENGATURAN & DATA — Tomy Eka RMX
   File ini dimuat oleh index.html sebelum script utama.
   Edit di sini: nomor WhatsApp, link, harga, dan daftar project.
   Taruh file ini di folder yang sama dengan index.html.
   ========================================================= */

var SITE = {
  name: "Tomy Eka RMX",
  // Nomor WhatsApp Business, format internasional tanpa + dan tanpa spasi. Contoh: 6281234567890
  waNumber: "62XXXXXXXXXXX",
  youtubeChannel: "https://www.youtube.com/@TomyEkaRMX",   // GANTI dengan link channel asli
  instagram: "",    // isi link bila ada, kosongkan bila tidak dipakai
  tiktok: "",
  email: "",
  // API key YouTube Data v3 (opsional). Bila kosong, jumlah view memakai nilai manualViews di tiap project.
  ytApiKey: ""
};

// Harga & jenis request DJ (kisaran Rp70.000 – Rp100.000). Ubah sesuai kebutuhan.
var DJ_SERVICES = [
  { id: "sholawat", icon: "🕌", name: "DJ Sholawat", price: 70000,
    desc: "Remix sholawat dengan aransemen bass yang tetap nyaman didengar.",
    features: ["Request lagu / sholawat pilihanmu", "Konsultasi langsung via WhatsApp", "Estimasi waktu disepakati saat pesan"] },
  { id: "trap", icon: "🔥", name: "DJ Trap", price: 85000, popular: true,
    desc: "Remix gaya trap dengan drop dan bass yang kuat.",
    features: ["Request lagu pilihanmu", "Konsultasi langsung via WhatsApp", "Estimasi waktu disepakati saat pesan"] },
  { id: "custom", icon: "👑", name: "DJ Custom Premium", price: 100000,
    desc: "Request khusus dengan konsep dan referensi sesuai keinginanmu.",
    features: ["Konsep & referensi bebas", "Diskusi detail sebelum dikerjakan", "Estimasi waktu disepakati saat pesan"] }
];

var FLM_PRICE = 50000;   // harga beli project FLM (pilihan isi sendiri)

/* DAFTAR PROJECT
   unlockViews : target view yang membuka download -> 500 atau 1000
   ytId        : ID video YouTube (11 karakter pada link youtube.com/watch?v=ID)
   manualViews : jumlah view cadangan bila ytApiKey kosong / API gagal
   downloadUrl : link tujuan saat download terbuka
   category    : "DJ Trap" atau "DJ Sholawat"
   Contoh di bawah hanya data percobaan. Ganti dengan project aslimu.
   PROJECT BARU: tambahkan objek baru di PALING BAWAH array (jangan ubah yang lama). */
var PROJECTS = [
  { id: "contoh-1", name: "Contoh Project DJ Sholawat 1", fileName: "Contoh_DJ_Sholawat_1.flm", category: "DJ Sholawat",
    ytId: "GANTI_ID_01", date: "2026-11-10", fileSize: "18 MB", fileType: "FLM (FL Studio Mobile)",
    unlockViews: 1000, manualViews: 1250, downloadUrl: "https://example.com/download/1" },
  { id: "contoh-2", name: "Contoh Project DJ Trap 1", fileName: "Contoh_DJ_Trap_1.flm", category: "DJ Trap",
    ytId: "GANTI_ID_02", date: "2026-11-12", fileSize: "22 MB", fileType: "FLM (FL Studio Mobile)",
    unlockViews: 500, manualViews: 320, downloadUrl: "https://example.com/download/2" },
  { id: "contoh-3", name: "Contoh Project DJ Trap 2", fileName: "Contoh_DJ_Trap_2.flm", category: "DJ Trap",
    ytId: "GANTI_ID_03", date: "2026-11-14", fileSize: "15 MB", fileType: "FLM (FL Studio Mobile)",
    unlockViews: 1000, manualViews: 860, downloadUrl: "https://example.com/download/3" },
  { id: "contoh-4", name: "Contoh Project DJ Sholawat 2", fileName: "Contoh_DJ_Sholawat_2.flm", category: "DJ Sholawat",
    ytId: "GANTI_ID_04", date: "2026-11-15", fileSize: "20 MB", fileType: "FLM (FL Studio Mobile)",
    unlockViews: 500, manualViews: 540, downloadUrl: "https://example.com/download/4" }
];
