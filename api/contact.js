// GNDLF — İletişim formu → Resend ile e-posta
// Sunucusuz (serverless) fonksiyon. Vercel / Netlify (Node 18+) uyumludur.
//
// GİZLİ ANAHTAR KODA YAZILMAZ. Aşağıdaki değerler ortam değişkeninden okunur:
//   RESEND_API_KEY  (zorunlu)  -> Resend API anahtarınız (host panelinde tanımlayın)
//   CONTACT_TO      (ops.)     -> alıcı e-posta (varsayılan: info@gndlf.io)
//   CONTACT_FROM    (ops.)     -> gönderen (varsayılan: Resend test göndereni)
//
// Not: CONTACT_FROM için kendi alan adınızı (gndlf.io) Resend'de doğrulamanız
// gerekir. Doğrulanana kadar "onboarding@resend.dev" yalnızca Resend hesabınızın
// e-postasına teslim edebilir.

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;      // Vercel: otomatik parse
  return await new Promise(function (resolve) {
    var data = '';
    req.on('data', function (c) { data += c; });
    req.on('end', function () { try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); } });
    req.on('error', function () { resolve({}); });
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  var apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'E-posta servisi yapılandırılmamış (RESEND_API_KEY tanımlı değil).' }));
  }

  var body = await readBody(req);
  var name = (body.name || '').toString().trim();
  var email = (body.email || '').toString().trim();
  var message = (body.message || '').toString().trim();

  if (!name || !email || !message) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Lütfen tüm alanları doldurun.' }));
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length > 5000) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Geçersiz e-posta veya mesaj.' }));
  }

  var TO = process.env.CONTACT_TO || 'info@gndlf.io';
  var FROM = process.env.CONTACT_FROM || 'GNDLF Web <onboarding@resend.dev>';

  var html =
    '<div style="font-family:Arial,sans-serif;line-height:1.6">' +
    '<h2 style="color:#0A1128">Yeni iletişim formu mesajı</h2>' +
    '<p><b>Ad Soyad:</b> ' + escapeHtml(name) + '</p>' +
    '<p><b>E-posta:</b> ' + escapeHtml(email) + '</p>' +
    '<p><b>Mesaj:</b></p><p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>' +
    '<hr><p style="color:#888;font-size:12px">gndlf.io iletişim formu</p></div>';

  try {
    var r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: 'GNDLF iletişim: ' + name,
        html: html
      })
    });
    if (!r.ok) {
      var detail = await r.text();
      res.statusCode = 502;
      return res.end(JSON.stringify({ error: 'E-posta gönderilemedi.', detail: detail }));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Sunucu hatası.' }));
  }
};
