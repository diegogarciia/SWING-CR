import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('#filtro-btn-activo, #filtro-btn');
    const contenedores = document.querySelectorAll('#tabla-actividades, #tabla-clases');
    
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = (btn.textContent.includes('Actividades')) ? 'tabla-actividades' : 'tabla-clases';
            
            contenedores.forEach(c => c.classList.add('oculto'));
            botones.forEach(b => {
                b.id = 'filtro-btn'; 
            });

            document.getElementById(targetId).classList.remove('oculto');
            btn.id = 'filtro-btn-activo'; 
            
            document.getElementById('titulo-programa').textContent = 
                (targetId === 'tabla-clases') ? 'Programa de Clases' : 'Programa de Actividades';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const btnActividades = document.querySelector('[data-target="tabla-actividades"]');
  const btnClases = document.querySelector('[data-target="tabla-clases"]');
  const tablaActividades = document.getElementById('tabla-actividades');
  const tablaClases = document.getElementById('tabla-clases');

  btnActividades.addEventListener('click', () => {
    tablaActividades.classList.add('activo');
    tablaActividades.classList.remove('oculto');
    tablaClases.classList.add('oculto');
    tablaClases.classList.remove('activo');
    btnActividades.id = 'filtro-btn-activo';
    btnClases.id = 'filtro-btn';
  });

  btnClases.addEventListener('click', () => {
    tablaClases.classList.add('activo');
    tablaClases.classList.remove('oculto');
    tablaActividades.classList.add('oculto');
    tablaActividades.classList.remove('activo');
    btnClases.id = 'filtro-btn-activo';
    btnActividades.id = 'filtro-btn';
  });
  
  const form = document.getElementById('registro-evento-form');
  const tipoEventoSelect = document.getElementById('tipo-evento');
  const ubicacionSelect = document.getElementById('ubicacion-evento');
  const tipoClaseSelect = document.getElementById('nivel-clase');
  const tipoActividadSelect = document.getElementById('tipo-actividad');
  const bandaSelect = document.getElementById('banda');
  const descripcionInput = document.getElementById('descripcion-actividad');

  tipoEventoSelect.addEventListener('change', () => {
      if (tipoEventoSelect.value === 'actividad') {
          ubicacionSelect.disabled = true;
          ubicacionSelect.value = '';
          tipoClaseSelect.disabled = true;
          tipoClaseSelect.value = '';
          tipoActividadSelect.disabled = false;
          descripcionInput.disabled = false;
          bandaSelect.disabled =  false;
      } else {
          ubicacionSelect.disabled = false;
          tipoClaseSelect.disabled = false;
          tipoActividadSelect.disabled = true;
          tipoActividadSelect.value = '';
          bandaSelect.disabled =  true;
          bandaSelect.value = '';
          descripcionInput.disabled = true;
          descripcionInput.value = '';
      }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const tipoEvento = document.getElementById('tipo-evento').value;
    const nombreEvento = document.getElementById('nombre-evento').value;
    const ubicacion = document.getElementById('ubicacion-evento').value;
    const dia = document.getElementById('dia-evento').value;
    const hora = document.getElementById('hora-evento').value.replace(':', '');
    const horaNumero = parseInt(hora);

    if ((dia === 'viernes' && horaNumero < 2000) || (dia === 'domingo' && horaNumero >= 2000)) {
        alert('Error: Los eventos solo pueden registrarse entre las 20:00 del viernes y las 20:00 del domingo.');
        return;
    }

    let celdaDestino = null;
    if (tipoEvento === 'actividad') {
      const selector = `.celda-evento-grid[data-dia="${dia}"][data-hora="${hora}"]`;
      celdaDestino = document.querySelector(selector);
    } else if (tipoEvento === 'clase') {
      if (dia === 'viernes') {
          alert('No se pueden registrar clases los viernes.');
          return;
      }
      const selector = `.celda-clase-grid[data-hora="${hora}"][data-sala="${ubicacion}"]`;
      celdaDestino = document.querySelector(selector);
    }
    
    if (!celdaDestino) {
        alert('La combinación de día, hora y/o sala no es válida o no existe en el horario.');
        return;
    }

    if (celdaDestino.innerHTML.trim() !== '') {
        alert('Error: ¡Esta franja horaria ya está ocupada!');
        return;
    }

    const nuevoEventoDiv = document.createElement('div');
    nuevoEventoDiv.className = 'evento-registrado';
    nuevoEventoDiv.textContent = nombreEvento;

    celdaDestino.innerHTML = '';
    celdaDestino.appendChild(nuevoEventoDiv);

    form.reset();
    ubicacionSelect.disabled = false;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const celdas = document.querySelectorAll(".celda-evento-grid, .celda-clase-grid");
  let celdaOrigen = null;

  function tipoCelda(celda) {
    return celda.classList.contains("celda-evento-grid") ? "actividad" : "clase";
  }

  function esCeldaPermitida(celda) {
    if (tipoCelda(celda) === "clase") return true;

    const dia = celda.getAttribute("data-dia");
    const hora = parseInt(celda.getAttribute("data-hora"));

    if (!dia || isNaN(hora)) return false;
    if (!["viernes", "sabado", "domingo"].includes(dia)) return false;
    if (dia === "viernes" && hora < 2000) return false;
    if (dia === "domingo" && hora > 2000) return false;

    return true;
  }

  celdas.forEach((celda) => {
    if (esCeldaPermitida(celda)) {
      celda.setAttribute("draggable", "true");
    } else {
      celda.removeAttribute("draggable");
    }

    celda.addEventListener("dragstart", (e) => {
      const target = e.currentTarget; 
      if (!esCeldaPermitida(target)) {
        e.preventDefault();
        return;
      }

      celdaOrigen = target;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", target.innerHTML);
      target.classList.add("arrastrando");
    });

    celda.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      e.currentTarget.classList.add("sobre-celda");
    });

    celda.addEventListener("dragleave", (e) => {
      e.currentTarget.classList.remove("sobre-celda");
    });

    celda.addEventListener("drop", (e) => {
      e.preventDefault();
      const destino = e.currentTarget; 

      destino.classList.remove("sobre-celda");
      if (!celdaOrigen || celdaOrigen === destino) return;

      const tipoOrigen = tipoCelda(celdaOrigen);
      const tipoDestino = tipoCelda(destino);

      if (tipoOrigen !== tipoDestino) {
        alert("No puedes mover una clase a la tabla de actividades ni viceversa.");
        return;
      }

      if (tipoOrigen === "actividad") {
        if (!esCeldaPermitida(celdaOrigen) || !esCeldaPermitida(destino)) {
          alert("No puedes mover una actividad fuera del horario permitido (viernes 20:00 a domingo 20:00).");
          return;
        }
      }

      const contenidoOrigen = celdaOrigen.innerHTML;
      const contenidoDestino = destino.innerHTML;
      const estiloOrigen = celdaOrigen.getAttribute("style") || "";
      const estiloDestino = destino.getAttribute("style") || "";

      const clasesOrigen = celdaOrigen.className.replace("arrastrando", "").replace("sobre-celda", "").trim();
      const clasesDestino = destino.className.replace("arrastrando", "").replace("sobre-celda", "").trim();

      celdaOrigen.innerHTML = contenidoDestino;
      destino.innerHTML = contenidoOrigen;

      celdaOrigen.setAttribute("style", estiloDestino);
      destino.setAttribute("style", estiloOrigen);
      celdaOrigen.className = clasesDestino;
      destino.className = clasesOrigen;

      celdaOrigen.classList.remove("arrastrando");
      celdaOrigen = null;
    });

    celda.addEventListener("dragend", (e) => {
      e.currentTarget.classList.remove("arrastrando");
      celdaOrigen = null;
    });
  });
});
