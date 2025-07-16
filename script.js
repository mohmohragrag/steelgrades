// script.js
const $ = id => document.getElementById(id);

const steelData = {
  S235: { ys: [235,225,215], ts: [[360,510],[360,510],[340,490]], A: [26,26,25],
    chem: { c:0.22, si:0.55, mn:1.6, p:0.045, s:0.045, n:0.014 } },
  S275: { ys: [275,265,255], ts: [[410,560],[410,560],[380,540]], A: [23,23,22],
    chem: { c:0.24, si:0.55, mn:1.6, p:0.045, s:0.045, n:0.014 } },
  S355: { ys: [355,345,335], ts: [[470,630],[470,630],[450,600]], A: [22,22,21],
    chem: { c:0.24, si:0.55, mn:1.6, p:0.045, s:0.045, n:0.014 } },
  S460: { ys: [460,440,420], ts: [[550,720],[550,720],[530,700]], A: [20,20,19],
    chem: { c:0.22, si:0.55, mn:1.6, p:0.045, s:0.045, n:0.014 } },
  S500: { ys: [500,480,460], ts: [[580,760],[580,760],[550,750]], A: [18,18,17],
    chem: { c:0.23, si:0.55, mn:1.6, p:0.045, s:0.045, n:0.014 } }
};

$('#checkBtn').addEventListener('click', () => {
  const t = +$('#thickness').value;
  const rp = +$('#rp').value;
  const rm = +$('#rm').value;
  const a = +$('#a').value;
  const chem = {
    c: +$('#c').value, mn: +$('#mn').value,
    si: +$('#si').value, p: +$('#p').value,
    s: +$('#s').value, n: +$('#n').value
  };

  let idx = t <= 16 ? 0 : t <= 40 ? 1 : 2;

  let match = null, msg = [], mechFail = '';

  for (let name in steelData) {
    let s = steelData[name];
    if (rp>=s.ys[idx] && rm>=s.ts[idx][0] && rm<=s.ts[idx][1] && a>=s.A[idx]) {
      let okChem = true;
      for (let k in s.chem) if (chem[k] > s.chem[k]) {
        okChem = false;
        msg.push(`❌ ${k.toUpperCase()} = ${chem[k]} (أعلى من الحد ${s.chem[k]})`);
      }
      if (okChem) { match = name; break; }
    } else {
      if (rp < s.ys[idx]) mechFail = `⚠️ Rp0.2 = ${rp} أقل من المطلوب (${s.ys[idx]})`;
      else if (rm < s.ts[idx][0] || rm > s.ts[idx][1])
        mechFail = `⚠️ Rm = ${rm} خارج النطاق (${s.ts[idx][0]}‑${s.ts[idx][1]})`;
      else if (a < s.A[idx])
        mechFail = `⚠️ A% = ${a} أقل من الحد (${s.A[idx]})`;
    }
  }

  if (match) {
    $('#result').className='ok';
    $('#result').textContent = `🟢 النوع: ${match}`;
    $('#root').textContent = '';
  } else {
    $('#result').className='err';
    $('#result').textContent = `❌ لا يوجد تطابق.\n${mechFail}`;
    $('#root').textContent = msg.join('\n');
  }

  $('#explain').textContent = '📊 تم تقييم جميع الخانات.';
});
