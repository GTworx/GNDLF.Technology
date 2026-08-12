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

## İletişim formu → e-posta (Resend)

"Bize Ulaşın" formu, `api/contact.js` sunucusuz (serverless) fonksiyonu
üzerinden **Resend** ile e-posta gönderir. API anahtarı **koda yazılmaz**;
barındırma panelinde ortam değişkeni olarak tanımlanır.

> ⚠️ **Güvenlik:** Resend API anahtarı gizlidir, tarayıcıya/HTML'e asla
> konmaz. Anahtar bir yerde açığa çıktıysa Resend panelinden **yenileyin
> (rotate)** ve yeni anahtarı kullanın.

### Vercel ile yayınlama (önerilen — form dahil çalışır)

1. https://vercel.com → GitHub ile giriş → **Add New → Project** →
   `oya-paktas/gndlf-website` reposunu içe aktarın → **Deploy**.
   (Statik `index.html` kök dizinden, `api/contact.js` otomatik fonksiyon olarak yayınlanır.)
2. Proje → **Settings → Environment Variables** → şunları ekleyin:
   - `RESEND_API_KEY` = Resend anahtarınız (yeni/rotate edilmiş)
   - `CONTACT_TO` = `info@gndlf.io` (mesajların geleceği adres)
   - `CONTACT_FROM` = `GNDLF Web <onboarding@resend.dev>` (test) ya da alan adı
     doğrulandıysa `GNDLF Web <noreply@gndlf.io>`
3. **Redeploy** edin. Artık form gerçek e-posta gönderir.

### Alan adı doğrulama (kendi adresinizden göndermek için)

Resend → **Domains** → `gndlf.io` ekleyip DNS kayıtlarını doğrulayın. Doğrulanana
kadar `onboarding@resend.dev` göndereni yalnızca Resend hesabınızın e-postasına
teslim edebilir.

> Not: **GitHub Pages** sunucusuz fonksiyon çalıştıramaz; formun e-posta
> göndermesi için Vercel/Netlify gibi bir host gerekir. Yerelde (çift tıklama)
> form, "yayınlanmış sitede çalışır" mesajı gösterir.

## Notlar

- SAP, ECC ve S/4HANA, SAP SE'nin ticari markalarıdır. GNDLF, SAP SE ile bağlı
  değildir. (Bu bilgi sitede de dipnot olarak yer alır.)
