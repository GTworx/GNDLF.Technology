// GNDLF — İletişim formu → Brevo ile e-posta (Netlify Functions)
//
// GİZLİ ANAHTAR KODA YAZILMAZ. Aşağıdaki değerler ortam değişkeninden okunur:
//   BREVO_API_KEY   (zorunlu)  -> Netlify: Site configuration > Environment variables
//   CONTACT_TO      (ops.)     -> alıcı e-posta(lar), virgülle ayrılmış
//                                  (varsayılan: oya@gndlf.io, gokhan@gndlf.io)
//   CONTACT_FROM    (ops.)     -> gönderen (varsayılan: GNDLF Web <info@gndlf.io>)
//
// Not: CONTACT_FROM için kendi alan adınızı (gndlf.io) Brevo'da doğrulamanız
// gerekir (Senders, Domains & Dedicated IPs > Domains).

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function parseSender(from) {
  var m = /^(.*)<(.+)>$/.exec(from || '');
  if (m) return { name: m[1].trim() || 'GNDLF Web', email: m[2].trim() };
  return { name: 'GNDLF Web', email: from || 'info@gndlf.io' };
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'E-posta servisi yapılandırılmamış (BREVO_API_KEY tanımlı değil).' }) };
  }

  var body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }

  var name = (body.name || '').toString().trim();
  var email = (body.email || '').toString().trim();
  var message = (body.message || '').toString().trim();

  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Lütfen tüm alanları doldurun.' }) };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length > 5000) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Geçersiz e-posta veya mesaj.' }) };
  }

  var TO = (process.env.CONTACT_TO || 'oya@gndlf.io,gokhan@gndlf.io')
    .split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
  var sender = parseSender(process.env.CONTACT_FROM || 'GNDLF Web <info@gndlf.io>');

  var html =
    '<div style="font-family:Arial,sans-serif;line-height:1.6">' +
    '<h2 style="color:#0A1128">Yeni iletişim formu mesajı</h2>' +
    '<p><b>Ad Soyad:</b> ' + escapeHtml(name) + '</p>' +
    '<p><b>E-posta:</b> ' + escapeHtml(email) + '</p>' +
    '<p><b>Mesaj:</b></p><p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>' +
    '<hr><p style="color:#888;font-size:12px">gndlf.io iletişim formu</p></div>';

  try {
    var r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        sender: sender,
        to: TO.map(function (e) { return { email: e }; }),
        replyTo: { email: email, name: name },
        subject: 'GNDLF iletişim: ' + name,
        htmlContent: html
      })
    });
    if (!r.ok) {
      var detail = await r.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'E-posta gönderilemedi.', detail: detail }) };
    }
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Sunucu hatası.' }) };
  }
};
