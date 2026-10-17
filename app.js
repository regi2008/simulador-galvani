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

// Estado de la animación
let anguloPierna = 0.0;
let anguloObjetivo = 0.0;
let enContacto = false;
let chispaActiva = false;
let voltajeActual = 0.0;

function resizeCanvas() {
  if (canvas.parentElement) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 100);

// Captura de elementos
const btnDescarga = document.getElementById('btnDescarga');
const btnMantener = document.getElementById('btnMantener');
const comboMetales = document.getElementById('comboMetales');
const sliderSensibilidad = document.getElementById('sliderSensibilidad');
const sliderFuerza = document.getElementById('sliderFuerza');
const sliderRelajacion = document.getElementById('sliderRelajacion');

const valSensibilidad = document.getElementById('valSensibilidad');
const valFuerza = document.getElementById('valFuerza');
const valRelajacion = document.getElementById('valRelajacion');

// Eventos
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

sliderSensibilidad.addEventListener('input', (e) => {
  sensibilidadNervio = parseFloat(e.target.value) / 100;
  if (valSensibilidad) valSensibilidad.textContent = `${e.target.value}%`;
  if (enContacto) estimular();
});

sliderFuerza.addEventListener('input', (e) => {
  fuerzaContraccion = parseFloat(e.target.value);
  if (valFuerza) valFuerza.textContent = `${e.target.value}°`;
  if (enContacto) estimular();
});

sliderRelajacion.addEventListener('input', (e) => {
  velocidadRelajacion = parseFloat(e.target.value) / 100;
  if (valRelajacion) valRelajacion.textContent = e.target.value;
});

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
  ctx.font = "bold 18px Segoe UI";
  ctx.fillText("EXPERIMENTO DE GALVANI: BIOELECTRICIDAD", 25, 35);

  // Galvanómetro
  const gx = canvas.width - 230, gy = 20;
  ctx.fillStyle = "#28190f";
  ctx.beginPath();
  ctx.roundRect(gx, gy, 200, 125, 10);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.roundRect(gx + 8, gy + 8, 184, 109, 6);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 10px Segoe UI";
  ctx.fillText("GALVANÓMETRO (VOLTIOS)", gx + 20, gy + 24);

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(gx + 100, gy + 80, 48, Math.PI * 1.25, Math.PI * 1.75);
  ctx.stroke();

  const anguloVal = Math.PI * 1.25 + ((voltajeActual / 1.60) * (Math.PI * 0.5));
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(gx + 100, gy + 80);
  ctx.lineTo(gx + 100 + 42 * Math.cos(anguloVal), gy + 80 + 42 * Math.sin(anguloVal));
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(gx + 50, gy + 88, 100, 18);
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 12px Monospaced";
  ctx.fillText(`${voltajeActual.toFixed(2)} V`, gx + 75, gy + 101);

  // Soporte Metálico
  const xCentro = Math.min(320, canvas.width / 2 - 40);
  ctx.fillStyle = "#505f73";
  ctx.fillRect(xCentro - 70, 80, 140, 8);
  ctx.strokeStyle = "#a0afbe";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xCentro, 88);
  ctx.lineTo(xCentro, 150);
  ctx.stroke();

  // Arco Bimetálico
  const xArco = xCentro - 120;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";

  ctx.strokeStyle = colorMetal1;
  ctx.beginPath();
  ctx.arc(xArco + 60, 230, 60, Math.PI, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Segoe UI";
  ctx.fillText(nombreMetal1, xArco - 20, 220);

  ctx.strokeStyle = colorMetal2;
  ctx.beginPath();
  ctx.arc(xArco + 60, 230, 60, Math.PI * 1.5, 0);
  ctx.stroke();
  ctx.fillText(nombreMetal2, xArco + 130, 220);

  // Anatomía
  const yCadera = 150;

  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xCentro, yCadera);
  ctx.lineTo(xCentro, yCadera + 50);
  ctx.stroke();

  ctx.fillStyle = "#fef08a";
  ctx.font = "italic 11px Segoe UI";
  ctx.fillText("Nervio Ciático", xCentro + 10, yCadera + 30);

  ctx.fillStyle = "#548a37";
  ctx.beginPath();
  ctx.ellipse(xCentro, yCadera + 80, 16, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#285019";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.save();
  ctx.translate(xCentro, yCadera + 116);
  ctx.rotate((anguloPierna * Math.PI) / 180);

  ctx.fillStyle = "#609b3e";
  ctx.beginPath();
  ctx.ellipse(0, 40, 10, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#4b7d32";
  ctx.beginPath();
  ctx.moveTo(0, 78);
  ctx.lineTo(30, 105);
  ctx.lineTo(-12, 105);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (chispaActiva || enContacto) {
    ctx.fillStyle = "rgba(255, 235, 59, 0.5)";
    ctx.beginPath();
    ctx.arc(xCentro, yCadera + 50, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(xCentro, yCadera + 50, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Monitor de Estado
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(25, canvas.height - 55, 320, 40, 6);
  ctx.fill();
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.stroke();

  const enContraccion = Math.abs(anguloPierna) > 10;
  ctx.fillStyle = enContraccion ? "#ff1744" : "#00e676";
  ctx.beginPath();
  ctx.arc(40, canvas.height - 35, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Segoe UI";
  if (enContraccion) {
    ctx.fillText(`ESTADO: Contracción (${Math.abs(anguloPierna).toFixed(1)}°)`, 55, canvas.height - 31);
  } else {
    ctx.fillText("ESTADO: Reposo (-70mV)", 55, canvas.height - 31);
  }
}

loop();