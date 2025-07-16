const spec = {
  S235: {
    c: 0.22, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014, cu: 0,
    yield: [235, 225, 215],
    tensile: [[360,510], [360,510], [340,490], [330,480]]
  },
  S275: {
    c: 0.24, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014, cu: 0,
    yield: [275, 265, 255],
    tensile: [[410,560], [410,560], [380,540], [380,540]]
  },
  S355: {
    c: 0.24, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014, cu: 0,
    yield: [355, 345, 335],
    tensile: [[470,630], [470,630], [450,600], [450,600]]
  },
  S460: {
    c: 0.22, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014, cu: 0,
    yield: [460, 440, 420],
    tensile: [[550,720], [550,720], [530,700], [530,700]]
  },
  S500: {
    c: 0.23, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014, cu: 0.6,
    yield: [500, 480, 460],
    tensile: [[580,760], [580,760], [550,750], [550,750]]
  },
};

const $ = id => document.getElementById(id);

function getRangeIndex(thk) {
  if (thk <= 16) return 0;
  if (thk <= 40) return 1;
  if (thk <= 63) return 2;
  return 3;
}

function checkSteel() {
  const d = {
    thk: +$('thickness').value,
    rp: +$('rp').value,
    rm: +$('rm').value,
    c: +$('c').value,
    mn: +$('mn').value,
    si: +$('si').value,
    p: +$('p').value,
    s: +$('s').value,
    n: +$('n').value,
    cu: +$('cu').value || 0
  };

  const index = getRangeIndex(d.thk);
  let match = null;
  let failReason = "";
  let lastCandidate = "";

  for (const [name, steel] of Object.entries(spec)) {
    const rpRequired = steel.yield[index];
    const [rmLow, rmHigh] = steel.tensile[index];

    const rpOK = d.rp >= rpRequired;
    const rmOK = d.rm >= rmLow && d.rm <= rmHigh;

    if (!rpOK) {
      failReason = `⚠️ السبب: Rp0.2 = ${d.rp} MPa أقل من الحد الأدنى المطلوب (${rpRequired} MPa) حسب التخانة ${d.thk} مم`;
    } else if (!rmOK) {
      failReason = `⚠️ السبب: Rm = ${d.rm} MPa خارج المدى المطلوب (${rmLow} إلى ${rmHigh} MPa)`;
    } else {
      match = name;
      break;
    }

    lastCandidate = name;
  }

  $('result').className = match ? 'ok' : 'err';
  if (match) {
    $('result').textContent = `🟢 النوع المتوقع: ${match}`;
  } else {
    $('result').textContent = `❌ لا يوجد تطابق مع درجات الصلب\n${failReason}`;
  }

  // شرح العناصر الكيميائية
  let ex = '📊 تحليل العناصر الكيميائية:\n';
  const limits = spec[match || lastCandidate || "S500"];
  for (const k of ["c", "mn", "si", "p", "s", "n", "cu"]) {
    if (d[k] > 0) {
      if (d[k] > limits[k])
        ex += `- ${k.toUpperCase()}% = ${d[k]} ➜ أعلى من الحد (${limits[k]})\n`;
      else
        ex += `- ${k.toUpperCase()}% = ${d[k]} ➜ ✅ ضمن الحد (${limits[k]})\n`;
    }
  }

  $('explain').textContent = ex;
}

document.getElementById("checkBtn").addEventListener("click", checkSteel);
