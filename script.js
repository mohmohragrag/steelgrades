const steels = {
  S235JR: {
    mech: { y16: 235, y40: 225, y63: 215, rm: [360, 510], a: 26 },
    chem: { c: 0.22, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014 }
  },
  S275JR: {
    mech: { y16: 275, y40: 265, y63: 255, rm: [410, 560], a: 23 },
    chem: { c: 0.24, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014 }
  },
  S355JR: {
    mech: { y16: 355, y40: 345, y63: 335, rm: [470, 630], a: 22 },
    chem: { c: 0.24, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014 }
  },
  S460JR: {
    mech: { y16: 460, y40: 440, y63: 420, rm: [550, 720], a: 17 },
    chem: { c: 0.22, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014 }
  },
  S500J0: {
    mech: { y16: 500, y40: 480, y63: 460, rm: [580, 760], a: 16 },
    chem: { c: 0.23, si: 0.55, mn: 1.6, p: 0.045, s: 0.045, n: 0.014 }
  }
};

function $(id) {
  return document.getElementById(id);
}

function checkSteel() {
  const thk = +$("thk").value;
  const rp = +$("rp").value;
  const rm = +$("rm").value;
  const a = +$("a").value;
  const c = +$("c").value;
  const mn = +$("mn").value;
  const si = +$("si").value;
  const p = +$("p").value;
  const s = +$("s").value;
  const n = +$("n").value;

  let resultText = "";
  let matched = null;

  for (const [name, steel] of Object.entries(steels)) {
    const fy =
      thk <= 16 ? steel.mech.y16 : thk <= 40 ? steel.mech.y40 : steel.mech.y63;
    if (
      rp >= fy &&
      rm >= steel.mech.rm[0] &&
      rm <= steel.mech.rm[1] &&
      a >= steel.mech.a &&
      c <= steel.chem.c &&
      mn <= steel.chem.mn &&
      si <= steel.chem.si &&
      p <= steel.chem.p &&
      s <= steel.chem.s &&
      n <= steel.chem.n
    ) {
      matched = name;
      break;
    }
  }

  if (matched) {
    $("result").className = "ok";
    resultText = `🟢 النوع المتوقع: ${matched}`;
  } else {
    $("result").className = "err";
    resultText = `❌ لا يوجد تطابق مع المواصفات المدخلة`;
  }

  $("result").textContent = resultText;

  const explain = [];
  explain.push(`📊 التحليل الكيميائي المدخل:`);
  explain.push(`- C: ${c}, Mn: ${mn}, Si: ${si}`);
  explain.push(`- P: ${p}, S: ${s}, N: ${n}`);
  $("explain").textContent = explain.join("\n");

  const root = [];
  if (rp < 200) root.push("- حد الخضوع منخفض جدًا");
  if (rm < 350) root.push("- مقاومة الشد منخفضة");
  if (a < 15) root.push("- الاستطالة ضعيفة");

  $("root").textContent = root.length
    ? `🔴 أسباب فشل مطابقة:\n${root.join("\n")}`
    : "";
}

$("checkBtn").addEventListener("click", checkSteel);
