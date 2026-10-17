const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

// Parámetros
let voltajeBase = 0.76;
let sensibilidadNervio = 1.0;
let fuerzaContraccion = 50.0;
let velocidadRelajacion = 0.08;
let nombreMetal1 = "Cobre (Cu)";
let nombreMetal2 = "Zinc (Zn)";
let colorMetal1 = "#e67e22";
let colorMetal2 = "#a0afbe";

// Estado
let anguloPierna = 0.0;
let anguloObjetivo = 0.0;
let enContacto = false;
let chispaActiva = false;
let voltajeActual = 0.0;

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const btnDescarga = document.getElementById('btnDescarga');
const btnMantener = document.getElementById('btnMantener');
const comboMetales = document.getElementById('comboMetales');
const sliderSensibilidad = document.getElementById('sliderSensibilidad');
const sliderFuerza = document.getElementById('sliderFuerza');
const sliderRelajacion = document.getElementById('sliderRelajacion');

btnDescarga.addEventListener('click', estimular);
btnMantener.addEventListener('click', () => {
  enContacto = !enContacto;
  btnMantener.classList.toggle('btn-active', enContacto);
  btnMantener.textContent = enContacto ? "🔓 Arco CONECTADO" : "🔒 Mantener Arco Bimetálico";
  if (enContacto) estimular();
});

comboMetales.addEventListener('change', (e) => {
  const idx = parseInt(e.target.value);
  if (idx === 0) { voltajeBase = 0.76; nombreMetal1 = "Cobre (Cu)"; nombreMetal2 = "Zinc (Zn)"; colorMetal1 = "#e67e22"; colorMetal2 = "#a0afbe"; }
  else if (idx === 1) { voltajeBase = 1.10; nombreMetal1 = "Plata (Ag)"; nombreMetal2 = "Zinc (Zn)"; colorMetal1 = "#dce1e6"; colorMetal2 = "#a0afbe"; }
  else if (idx === 2) { voltajeBase = 0.30; nombreMetal1 = "Hierro (Fe)"; nombreMetal2 = "Cobre (Cu)"; colorMetal1 = "#78787d"; colorMetal2 = "#e67e22"; }
  else if (idx === 3) { voltajeBase = 1.50; nombreMetal1 = "Oro (Au)"; nombreMetal2 = "Aluminio (Al)"; colorMetal1 = "#f1c40f"; colorMetal2 = "#c8cdd2"; }
  if (enContacto) estimular();
});

sliderSensibilidad.addEventListener('input', e => sensibilidadNervio = e.target.value / 100);
sliderFuerza.addEventListener('input', e => fuerzaContraccion = parseFloat(e.target.value));
sliderRelajacion.addEventListener('input', e => velocidadRelajacion = e.target.value / 100);

function estimular() {
  const respuesta = (voltajeBase / 0.76) * sensibilidadNervio;
  anguloObjetivo = -Math.min(85.0, fuerzaContraccion * respuesta);
  chispaActiva = true;
}

function loop() {
  if (chispaActiva) {
    anguloPierna += (anguloObjetivo - anguloPierna) * 0.35;
    voltajeActual += (voltajeBase - voltajeActual) * 0.4;
    if (Math.abs(anguloPierna - anguloObjetivo) < 1.0) chispaActiva = false;
  } else if (!enContacto) {
    anguloPierna += (0.0 - anguloPierna) * velocidadRelajacion;
    voltajeActual += (0.0 - voltajeActual) * 0.1;
  }

  render();
  requestAnimationFrame(loop);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Título e instrucciones
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Segoe UI";
  ctx.fillText("EXPERIMENTO DE GALVANI: BIOELECTRICIDAD", 30, 40);

  ctx.fillStyle = "#b4c3d7";
  ctx.font = "12px Segoe UI";
  ctx.fillText("Modifique los parámetros para observar la variación biológica.", 30, 60);

  // 2. Galvanómetro Vintage estilizado
  const gx = canvas.width - 240, gy = 30;
  ctx.fillStyle = "#28190f";
  ctx.beginPath();
  ctx.roundRect(gx, gy, 210, 135, 12);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.roundRect(gx + 10, gy + 10, 190, 115, 8);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 11px Segoe UI";
  ctx.fillText("GALVANÓMETRO (VOLTIOS)", gx + 25, gy + 28);

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(gx + 105, gy + 90, 55, Math.PI * 1.25, Math.PI * 1.75);
  ctx.stroke();

  // Aguja del galvanómetro
  const anguloVal = Math.PI * 1.25 + ((voltajeActual / 1.60) * (Math.PI * 0.5));
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(gx + 105, gy + 90);
  ctx.lineTo(gx + 105 + 50 * Math.cos(anguloVal), gy + 90 + 50 * Math.sin(anguloVal));
  ctx.stroke();

  // Lectura Digital
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(gx + 55, gy + 98, 100, 20);
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 13px Monospaced";
  ctx.fillText(`${voltajeActual.toFixed(2)} V`, gx + 82, gy + 113);

  // 3. Soporte Metálico
  const xCentro = Math.min(380, canvas.width / 2 - 50);
  ctx.fillStyle = "#505f73";
  ctx.fillRect(xCentro - 80, 95, 160, 10);
  ctx.strokeStyle = "#a0afbe";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xCentro, 105);
  ctx.lineTo(xCentro, 180);
  ctx.stroke();

  // 4. Arco Bimetálico (Cobre y Zinc)
  const xArco = xCentro - 140;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  // Electrodo 1
  ctx.strokeStyle = colorMetal1;
  ctx.beginPath();
  ctx.arc(xArco + 70, 270, 70, Math.PI, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px Segoe UI";
  ctx.fillText(nombreMetal1, xArco - 20, 260);

  // Electrodo 2
  ctx.strokeStyle = colorMetal2;
  ctx.beginPath();
  ctx.arc(xArco + 70, 270, 70, Math.PI * 1.5, 0);
  ctx.stroke();
  ctx.fillText(nombreMetal2, xArco + 150, 260);

  // 5. Anatomía de la Rana
  const yCadera = 180;

  // Nervio Ciático
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xCentro, yCadera);
  ctx.lineTo(xCentro, yCadera + 60);
  ctx.stroke();

  ctx.fillStyle = "#fef08a";
  ctx.font = "italic 11px Segoe UI";
  ctx.fillText("Nervio Ciático", xCentro + 12, yCadera + 35);

  // Muslo Femoral
  ctx.fillStyle = "#548a37";
  ctx.beginPath();
  ctx.ellipse(xCentro, yCadera + 95, 18, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#285019";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pantorrilla y Pie Articulado
  ctx.save();
  ctx.translate(xCentro, yCadera + 135);
  ctx.rotate((anguloPierna * Math.PI) / 180);

  // Pantorrilla
  ctx.fillStyle = "#609b3e";
  ctx.beginPath();
  ctx.ellipse(0, 48, 12, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pie
  ctx.fillStyle = "#4b7d32";
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.lineTo(35, 120);
  ctx.lineTo(-15, 120);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. Chispazo Eléctrico
  if (chispaActiva || enContacto) {
    ctx.fillStyle = "rgba(255, 235, 59, 0.5)";
    ctx.beginPath();
    ctx.arc(xCentro, yCadera + 65, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(xCentro, yCadera + 65, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. Monitor de Estado
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(30, canvas.height - 70, 360, 48, 8);
  ctx.fill();
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.stroke();

  const enContraccion = Math.abs(anguloPierna) > 12;
  ctx.fillStyle = enContraccion ? "#ff1744" : "#00e676";
  ctx.beginPath();
  ctx.arc(48, canvas.height - 46, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px Segoe UI";
  if (enContraccion) {
    ctx.fillText(`ESTADO: Despolarización ( Flexión: ${Math.abs(anguloPierna).toFixed(1)}° )`, 68, canvas.height - 42);
  } else {
    ctx.fillText("ESTADO: Reposo (Potencial -70mV)", 68, canvas.height - 42);
  }
}

loop();