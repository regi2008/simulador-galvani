const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

let voltajeBase = 0.76;
let sensibilidadNervio = 1.0;
let fuerzaContraccion = 50.0;
let velocidadRelajacion = 0.08;
let nombreMetal1 = "Cobre (Cu)";
let nombreMetal2 = "Zinc (Zn)";
let colorMetal1 = "#e67e22";
let colorMetal2 = "#a0afbe";

let anguloPierna = 0.0;
let anguloObjetivo = 0.0;
let enContacto = false;
let chispaActiva = false;
let voltajeActual = 0.0;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
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

  // Encabezado
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Segoe UI";
  ctx.fillText("EXPERIMENTO DE GALVANI: BIOELECTRICIDAD", 30, 40);

  // Galvanómetro
  const gx = canvas.width - 250, gy = 30;
  ctx.fillStyle = "#28190f";
  ctx.fillRect(gx, gy, 220, 140);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(gx + 10, gy + 10, 200, 120);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 11px Segoe UI";
  ctx.fillText("GALVANÓMETRO (VOLTIOS)", gx + 25, gy + 28);

  ctx.beginPath();
  ctx.arc(gx + 100, gy + 95, 60, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  const ang = (Math.PI) - ((voltajeActual / 1.60) * (Math.PI / 2));
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gx + 100, gy + 95);
  ctx.lineTo(gx + 100 + 50 * Math.cos(ang), gy + 95 - 50 * Math.sin(ang));
  ctx.stroke();

  // Anatomía
  const xCadera = 300, yCadera = 180;
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xCadera, yCadera);
  ctx.lineTo(xCadera, yCadera + 60);
  ctx.stroke();

  // Músculo
  ctx.fillStyle = "#548a37";
  ctx.beginPath();
  ctx.ellipse(xCadera, yCadera + 90, 18, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pierna articulada
  ctx.save();
  ctx.translate(xCadera, yCadera + 130);
  ctx.rotate((anguloPierna * Math.PI) / 180);

  ctx.fillStyle = "#609b3e";
  ctx.beginPath();
  ctx.ellipse(0, 45, 12, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

loop();