// GNDLF — İletişim formları → Brevo ile e-posta
// Sunucusuz (serverless) fonksiyon. Vercel / Netlify (Node 18+) uyumludur.
// Hem ana site formunu hem de PMO Cockpit formunu (body.source === 'pmo-cockpit') besler.
//
// GİZLİ ANAHTAR KODA YAZILMAZ. Aşağıdaki değerler ortam değişkeninden okunur:
//   BREVO_API_KEY    (zorunlu)  -> Brevo API anahtarınız (host panelinde tanımlayın)
//   CONTACT_TO       (ops.)     -> ana site alıcı e-posta(lar), virgülle ayrılmış
//                                   (varsayılan: oya@gndlf.io, gokhan@gndlf.io)
//   CONTACT_TO_PMO   (ops.)     -> PMO Cockpit alıcı e-posta(lar), virgülle ayrılmış
//                                   (varsayılan: gokhan@, oya@, sales@, pmocockpit@gndlf.io)
//   CONTACT_FROM     (ops.)     -> gönderen (varsayılan: GNDLF Web <info@gndlf.io>)
//
// Not: CONTACT_FROM için kendi alan adınızı (gndlf.io) Brevo'da doğrulamanız
// gerekir (Senders & IP > Domains).

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

  var apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'E-posta servisi yapılandırılmamış (BREVO_API_KEY tanımlı değil).' }));
  }

  var body = await readBody(req);
  var name = (body.name || '').toString().trim();
  var email = (body.email || '').toString().trim();
  var message = (body.message || '').toString().trim();
  var company = (body.company || '').toString().trim();
  var interest = (body.interest || '').toString().trim();
  var isPmo = body.source === 'pmo-cockpit';

  if (!name || !email || !message) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Lütfen tüm alanları doldurun.' }));
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length > 5000) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Geçersiz e-posta veya mesaj.' }));
  }

  var TO = (
    (isPmo ? process.env.CONTACT_TO_PMO : process.env.CONTACT_TO) ||
    (isPmo ? 'gokhan@gndlf.io,oya@gndlf.io,sales@gndlf.io,pmocockpit@gndlf.io' : 'oya@gndlf.io,gokhan@gndlf.io')
  ).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var sender = parseSender(process.env.CONTACT_FROM || 'GNDLF Web <info@gndlf.io>');

  var html =
    '<div style="font-family:Arial,sans-serif;line-height:1.6">' +
    '<h2 style="color:#0A1128">' + (isPmo ? 'Yeni PMO Cockpit iletişim mesajı' : 'Yeni iletişim formu mesajı') + '</h2>' +
    '<p><b>Ad Soyad:</b> ' + escapeHtml(name) + '</p>' +
    (company ? '<p><b>Şirket:</b> ' + escapeHtml(company) + '</p>' : '') +
    '<p><b>E-posta:</b> ' + escapeHtml(email) + '</p>' +
    (interest ? '<p><b>İlgi alanı:</b> ' + escapeHtml(interest) + '</p>' : '') +
    '<p><b>Mesaj:</b></p><p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>' +
    '<hr><p style="color:#888;font-size:12px">' + (isPmo ? 'gndlf.io PMO Cockpit formu' : 'gndlf.io iletişim formu') + '</p></div>';

  try {
    var r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        sender: sender,
        to: TO.map(function (e) { return { email: e }; }),
        replyTo: { email: email, name: name },
        subject: (isPmo ? 'PMO Cockpit iletişim: ' : 'GNDLF iletişim: ') + name,
        htmlContent: html
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
