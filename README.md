# GNDLF Technologies — Kurumsal Web Sitesi

GNDLF Technologies kurumsal kimliğine (marka kılavuzu) uygun, tek sayfalık
(single-page) tanıtım web sitesi. **Smart Solutions. Stronger Futures.**

Statik bir sitedir — derleme (build) adımı, bağımlılık veya sunucu gerektirmez.

## Kurumsal Kimlik

| Öğe | Değer |
|-----|-------|
| Renkler | `#0A1128` (lacivert), `#D4AF37` (altın), `#1F2A44` (koyu mavi), `#E6EBF2` (açık gri), `#FFFFFF` |
| Tipografi | Montserrat (Bold / Semibold / Regular) |
| Slogan | SMART SOLUTIONS. STRONGER FUTURES. |
| İletişim | info@gndlf.io · www.gndlf.io |

## İçerik / Bölümler

1. **Hero** — slogan, açıklama ve animasyonlu ağ (network) arka planı
2. **Değerler** — Enterprise Focused, Secure & Reliable, Innovative Technology, Expert Team, Global Vision
3. **Çözümlerimiz** — Enterprise / Security & Compliance / AI & Talent / Analytics / Learning
4. **SAP Çözümlerimiz** — E-Dönüşüm, Finansal, Veri & Risk, Dış Ticaret, Raporlama
5. **Neden GNDLF?** — Güvenilir, Yenilikçi, Uzman Kadro, Sonuç Odaklı, Küresel Yaklaşım
6. **İletişim** — iletişim bilgileri ve form (ön yüz; bir backend'e bağlanabilir)
7. **Footer**

## Dil desteği (TR / EN)

Site iki dillidir. Sağ üstteki **TR / EN** düğmesiyle geçiş yapılır; seçim
`localStorage` içinde saklanır ve sonraki ziyaretlerde hatırlanır. İlk ziyarette
tarayıcı diline göre otomatik seçilir. Çeviriler `assets/js/main.js` içindeki
`I18N` sözlüğündedir; HTML'de çevrilecek öğeler `data-i18n` (ve input
placeholder'ları için `data-ph`) ile işaretlenmiştir.

## Çalıştırma (PowerShell)

Site tamamen istemci taraflıdır; dilerseniz `index.html`'i doğrudan
tarayıcıda açabilirsiniz:

```powershell
Invoke-Item .\index.html
```

Yerel sunucu tercih ederseniz (Python kuruluysa):

```powershell
cd gndlf-website
python -m http.server 8000    # tarayıcı: http://localhost:8000
```

Ya da Node.js varsa: `npx serve .`

## Kendi GitHub reposuna gönderme

Depoyu tek komutla oluşturup göndermek için (GitHub CLI `gh` önerilir):

```powershell
cd gndlf-website
.\create-repo.ps1
```

Ayrıntılar ve `gh`'siz alternatif için `create-repo.ps1` başındaki açıklamaya bakın.

## Klasör yapısı

```
gndlf-website/
  index.html
  create-repo.ps1         # kendi GitHub reposunu oluşturup push eden yardımcı
  assets/
    css/styles.css        # tüm stiller (marka renk değişkenleri :root içinde)
    js/main.js            # i18n (TR/EN), ikon enjeksiyonu, hero canvas, etkileşimler
    img/
      logo-mark.svg       # GNDLF "G" logo işareti
      favicon.svg
```

## Notlar

- **İkonlar** `main.js` içinde satır içi (inline) SVG olarak tutulur ve
  `currentColor` kullanır; renkleri CSS'ten kontrol edilir.
- **Erişilebilirlik / dayanıklılık:** İçerik JS olmadan da görünür
  (progressive enhancement); animasyonlar `prefers-reduced-motion` tercihine
  saygı gösterir.
- **İletişim formu** yalnızca ön yüzdür; gerçek gönderim için bir e-posta
  servisine ya da API endpoint'ine bağlanması gerekir.
- Montserrat, Google Fonts üzerinden yüklenir; erişilemezse sistem fontuna
  düşer (fallback).
