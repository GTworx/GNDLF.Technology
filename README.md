# GNDLF Technologies — Kurumsal Web Sitesi

GNDLF Technologies kurumsal kimliğine uygun, **tek dosyalık** tanıtım web
sitesi. **Smart Solutions. Stronger Futures.**

Tüm site tek bir `index.html` dosyasındadır — CSS, JavaScript, ikonlar ve logo
dosyanın içine gömülüdür. Harici dosya, derleme (build) veya sunucu gerekmez.

## Açmak

`index.html` dosyasına **çift tıklayın** — varsayılan tarayıcınızda açılır.
İnternet bağlantısı gerekmez (yazı tipi çevrimdışıysa sistem fontuna düşer).

## Kurumsal Kimlik

| Öğe | Değer |
|-----|-------|
| Renkler | `#0A1128` (lacivert), `#D4AF37` (altın), `#1F2A44`, `#E6EBF2`, `#FFFFFF` |
| Tipografi | Montserrat |
| Slogan | SMART SOLUTIONS. STRONGER FUTURES. |
| İletişim | info@gndlf.io · www.gndlf.io |

## Diller

Sağ üstteki **TR / EN** düğmesiyle Türkçe ↔ İngilizce geçişi yapılır. Seçim
tarayıcıda saklanır; ilk ziyarette tarayıcı diline göre otomatik seçilir.

## Bölümler

Hero · Değerler · Çözümlerimiz · SAP Çözümlerimiz · Neden GNDLF · İletişim (form) · Footer

## Yayınlama (opsiyonel)

Canlı bir adreste yayınlamak için `index.html`'i herhangi bir statik hostinge
(GitHub Pages, Netlify, Vercel) yükleyin. GitHub Pages: **Settings → Pages →
Source: `main` / root**.

## İletişim formu → e-posta (Brevo)

"Bize Ulaşın" formu, `api/contact.js` sunucusuz (serverless) fonksiyonu
üzerinden **Brevo** ile e-posta gönderir. API anahtarı **koda yazılmaz**;
barındırma panelinde ortam değişkeni olarak tanımlanır. Mesajlar varsayılan
olarak `oya@gndlf.io` ve `gokhan@gndlf.io` adreslerine gider.

> ⚠️ **Güvenlik:** Brevo API anahtarı gizlidir, tarayıcıya/HTML'e asla
> konmaz. Anahtar bir yerde açığa çıktıysa Brevo panelinden **yenileyin
> (rotate)** ve yeni anahtarı kullanın.

### Netlify ile yayınlama (önerilen — form dahil çalışır)

1. https://app.netlify.com → **Add new site → Import an existing project** →
   bu repoyu seçin → **Deploy**.
   (`netlify.toml` sayesinde statik `index.html` kök dizinden, `netlify/functions/contact.js`
   otomatik fonksiyon olarak yayınlanır ve `/api/contact` isteği ona yönlendirilir.)
2. Site → **Site configuration → Environment variables** → şunları ekleyin:
   - `BREVO_API_KEY` = Brevo API anahtarınız
   - `CONTACT_TO` = `oya@gndlf.io,gokhan@gndlf.io` (ana site formunun gideceği adresler)
   - `CONTACT_TO_PMO` = `gokhan@gndlf.io,oya@gndlf.io,sales@gndlf.io,pmocockpit@gndlf.io` (PMO Cockpit formu)
   - `CONTACT_FROM` = `GNDLF Web <info@gndlf.io>` (alan adı Brevo'da doğrulandıysa)
3. **Redeploy** edin (Deploys → Trigger deploy). Artık her iki form da gerçek e-posta gönderir.

### Vercel ile yayınlama (alternatif)

1. https://vercel.com → GitHub ile giriş → **Add New → Project** →
   bu repoyu içe aktarın → **Deploy**.
   (Statik `index.html` kök dizinden, `api/contact.js` otomatik fonksiyon olarak yayınlanır.)
2. Proje → **Settings → Environment Variables** → aynı değişkenleri ekleyin
   (`BREVO_API_KEY`, `CONTACT_TO`, `CONTACT_TO_PMO`, `CONTACT_FROM`).
3. **Redeploy** edin.

### Alan adı doğrulama (kendi adresinizden göndermek için)

Brevo → **Senders, Domains & Dedicated IPs → Domains** → `gndlf.io` ekleyip
DNS kayıtlarını doğrulayın. Doğrulanana kadar yalnızca Brevo hesabınızda
doğrulanmış bir gönderen adresi kullanabilirsiniz.

> Not: **GitHub Pages** sunucusuz fonksiyon çalıştıramaz; formun e-posta
> göndermesi için Vercel/Netlify gibi bir host gerekir. Yerelde (çift tıklama)
> form, "yayınlanmış sitede çalışır" mesajı gösterir.

## Notlar

- SAP, ECC ve S/4HANA, SAP SE'nin ticari markalarıdır. GNDLF, SAP SE ile bağlı
  değildir. (Bu bilgi sitede de dipnot olarak yer alır.)
