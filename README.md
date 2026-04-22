# Form QC Laptop

Web app sederhana untuk melakukan Quality Control (QC) laptop sebelum diserahkan ke penyewa. Tidak memerlukan framework, build tool, atau koneksi internet — cukup buka `index.html` di browser.

## Struktur File

```
qc-laptop/
├── index.html   # Markup & struktur halaman
├── style.css    # Styling (light + dark mode)
├── app.js       # Logic checklist, state, dan cetak PDF
└── README.md
```

## Cara Pakai

1. **Download / clone** folder ini ke komputer.
2. Buka `index.html` langsung di browser (Chrome / Edge / Firefox direkomendasikan).
3. Isi semua bagian form:
   - Informasi penyewaan & identitas perangkat
   - Checklist kondisi fisik (Normal / Abnormal / On / Off)
   - Checklist fungsi sistem
   - Checklist software & konfigurasi
   - Aksesoris yang disertakan
   - Catatan / temuan
   - Kesimpulan QC
4. Klik **Simpan & Cetak** atau **Cetak PDF** untuk membuka jendela cetak browser.
   - Pilih "Save as PDF" di dialog cetak untuk menyimpan file PDF.

## Fitur

- **Progress bar** kelengkapan pengisian form secara real-time
- **Tombol opsi** berwarna (hijau = Normal/On/Ready, merah = Abnormal/Off, abu = tidak berlaku)
- **Aksesori** toggle Ya / Tidak
- **Kesimpulan** 3 pilihan: Siap Digunakan, Perlu Perbaikan, Tidak Layak Pakai
- **Cetak PDF** dengan layout dokumen rapi, kolom tanda tangan teknisi & penyewa
- **Dark mode** otomatis mengikuti preferensi sistem
- **Responsive** untuk layar kecil / mobile

## Kustomisasi

Semua item checklist didefinisikan sebagai array konstanta di bagian atas `app.js`:

```js
const FISIK_ITEMS    = [ ... ];   // Kondisi fisik
const SISTEM_ITEMS   = [ ... ];   // Fungsi sistem
const SOFTWARE_ITEMS = [ ... ];   // Software & konfigurasi
const AKSESORI_ITEMS = [ ... ];   // Aksesoris
```

Tambah, hapus, atau ubah item sesuai kebutuhan tanpa perlu menyentuh HTML.

Warna dan ukuran dapat disesuaikan melalui CSS custom properties (variabel) di bagian `:root` dalam `style.css`.

## Kompatibilitas Browser

Berjalan di semua browser modern: Chrome 90+, Edge 90+, Firefox 88+, Safari 14+.
Tidak memerlukan internet atau server — cukup file lokal.
