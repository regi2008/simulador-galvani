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
  const container = canvas.parentElement;
  if (container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 50);

const btnDescarga = document.getElementById('btnDescarga');
const btnMantener = document.getElementById('btnMantener');
const comboMetales = document.getElementById('comboMetales');
const sliderSensibilidad = document.getElementById('sliderSensibilidad');
const sliderFuerza = document.getElementById('sliderFuerza');
const sliderRelajacion = document.getElementById('sliderRelajacion');

const valSensibilidad = document.getElementById('valSensibilidad');
const valFuerza = document.getElementById('valFuerza');
const valRelajacion = document.getElementById('valRelajacion');

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

// Actualización dinámica en vivo para cada deslizador
function actualizarValoresUI() {
  if (sliderSensibilidad && valSensibilidad) {
    sensibilidadNervio = parseFloat(sliderSensibilidad.value) / 100;
    valSensibilidad.innerText = sliderSensibilidad.value + "%";
  }
  if (sliderFuerza && valFuerza) {
    fuerzaContraccion = parseFloat(sliderFuerza.value);
    valFuerza.innerText = sliderFuerza.value + "°";
  }
  if (sliderRelajacion && valRelajacion) {
    velocidadRelajacion = parseFloat(sliderRelajacion.value) / 100;
    valRelajacion.innerText = sliderRelajacion.value;
  }
  if (enContacto) estimular();
}

// Escuchar tanto 'input' como 'change' para máxima compatibilidad
['input', 'change'].forEach(evento => {
  if (sliderSensibilidad) sliderSensibilidad.addEventListener(evento, actualizarValoresUI);
  if (sliderFuerza) sliderFuerza.addEventListener(evento, actualizarValoresUI);
  if (sliderRelajacion) sliderRelajacion.addEventListener(evento, actualizarValoresUI);
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
  const gx = canvas.width - 220, gy = 20;
  ctx.fillStyle = "#28190f";
  ctx.beginPath();
  ctx.roundRect(gx, gy, 190, 120, 10);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.roundRect(gx + 8, gy + 8, 174, 104, 6);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 10px Segoe UI";
  ctx.fillText("GALVANÓMETRO (VOLTIOS)", gx + 18, gy + 22);

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(gx + 95, gy + 75, 45, Math.PI * 1.25, Math.PI * 1.75);
  ctx.stroke();

  const anguloVal = Math.PI * 1.25 + ((voltajeActual / 1.60) * (Math.PI * 0.5));
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(gx + 95, gy + 75);
  ctx.lineTo(gx + 95 + 40 * Math.cos(anguloVal), gy + 75 + 40 * Math.sin(anguloVal));
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(gx + 48, gy + 82, 94, 18);
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 12px Monospaced";
  ctx.fillText(`${voltajeActual.toFixed(2)} V`, gx + 72, gy + 95);

  // Soporte Metálico
  const xCentro = canvas.width / 2;
  ctx.fillStyle = "#505f73";
  ctx.fillRect(xCentro - 70, 70, 140, 8);
  ctx.strokeStyle = "#a0afbe";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xCentro, 78);
  ctx.lineTo(xCentro, 130);
  ctx.stroke();

  // Arco Bimetálico
  const xArco = xCentro - 120;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";

  ctx.strokeStyle = colorMetal1;
  ctx.beginPath();
  ctx.arc(xArco + 60, 200, 60, Math.PI, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Segoe UI";
  ctx.fillText(nombreMetal1, xArco - 20, 190);

  ctx.strokeStyle = colorMetal2;
  ctx.beginPath();
  ctx.arc(xArco + 60, 200, 60, Math.PI * 1.5, 0);
  ctx.stroke();
  ctx.fillText(nombreMetal2, xArco + 130, 190);

  // Anatomía
  const yCadera = 130;

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
  ctx.roundRect(25, canvas.height - 50, 310, 38, 6);
  ctx.fill();
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.stroke();

  const enContraccion = Math.abs(anguloPierna) > 10;
  ctx.fillStyle = enContraccion ? "#ff1744" : "#00e676";
  ctx.beginPath();
  ctx.arc(40, canvas.height - 31, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Segoe UI";
  if (enContraccion) {
    ctx.fillText(`ESTADO: Contracción (${Math.abs(anguloPierna).toFixed(1)}°)`, 55, canvas.height - 27);
  } else {
    ctx.fillText("ESTADO: Reposo (-70mV)", 55, canvas.height - 27);
  }
}

loop();