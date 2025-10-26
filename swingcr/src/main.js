import './style.css'
import { Evento } from './evento.js';
import { Horario } from './horario.js';

document.addEventListener('DOMContentLoaded', () => {
  const horario = new Horario();
  const botonesFiltro = document.querySelectorAll('.filtros-programa button');
  const contenedoresTabla = document.querySelectorAll('.tabla-programa-contenedor');
  const tituloPrograma = document.getElementById('titulo-programa');

  botonesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
      contenedoresTabla.forEach(c => c.classList.add('oculto'));
      botonesFiltro.forEach(b => b.id = 'filtro-btn');

      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('oculto');
      btn.id = 'filtro-btn-activo';

      tituloPrograma.textContent = (targetId === 'tabla-clases') ? 'Programa de Clases' : 'Programa de Actividades';
    });
  });

  const form = document.getElementById('registro-evento-form');
  const tipoEventoSelect = document.getElementById('tipo-evento');
  const ubicacionSelect = document.getElementById('ubicacion-evento');
  const tipoClaseSelect = document.getElementById('nivel-clase');
  const tipoActividadSelect = document.getElementById('tipo-actividad');
  const bandaSelect = document.getElementById('banda-evento');
  const descripcionInput = document.getElementById('descripcion-actividad');

  tipoEventoSelect.addEventListener('change', () => {
    const tipo = tipoEventoSelect.value;
    ubicacionSelect.disabled = (tipo !== 'clase');
    tipoClaseSelect.disabled = (tipo !== 'clase');
    tipoActividadSelect.disabled = (tipo !== 'actividad');
    descripcionInput.disabled = (tipo !== 'actividad');
    bandaSelect.disabled = (tipo !== 'actividad');

    if (tipo === 'actividad') {
      ubicacionSelect.value = '';
      tipoClaseSelect.value = '';
    } else {
      tipoActividadSelect.value = '';
      bandaSelect.value = '';
      descripcionInput.value = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const tipoEvento = tipoEventoSelect.value;
    const nombreEvento = document.getElementById('nombre-evento').value;
    const dia = document.getElementById('dia-evento').value;
    const hora = document.getElementById('hora-evento').value.replace(':', '');
    const horaNumero = parseInt(hora);

    if (!tipoEvento || !nombreEvento || !dia || !hora) {
        alert("Por favor, rellena todos los campos básicos.");
        return;
    }
    if ((dia === 'viernes' && horaNumero < 2000) || (dia === 'domingo' && horaNumero >= 2000)) {
      alert('Error: Los eventos solo pueden registrarse entre las 20:00 del viernes y las 20:00 del domingo.');
      return;
    }

    let celdaDestino = null;
    if (tipoEvento === 'actividad') {
      celdaDestino = document.querySelector(`.celda-evento-grid[data-dia="${dia}"][data-hora="${hora}"]`);
    } else if (tipoEvento === 'clase') {
      const ubicacion = ubicacionSelect.value;
      celdaDestino = document.querySelector(`.celda-clase-grid[data-hora="${hora}"][data-sala="${ubicacion}"]`);
    }
    
    if (!celdaDestino) {
      alert('La combinación de día, hora y/o sala no es válida.');
      return;
    }

    if (celdaDestino.innerHTML.trim() !== '') {
      alert('Error: ¡Esta franja horaria ya está ocupada!');
      return;
    }

    const nuevoEventoDiv = document.createElement('div');
    nuevoEventoDiv.className = 'evento-registrado';

    nuevoEventoDiv.dataset.nombre = nombreEvento;
    nuevoEventoDiv.dataset.dia = document.getElementById('dia-evento').options[document.getElementById('dia-evento').selectedIndex].text;
    nuevoEventoDiv.dataset.hora = document.getElementById('hora-evento').value;

    if (tipoEvento === 'clase') {
      nuevoEventoDiv.dataset.tipo = 'Clase';
      nuevoEventoDiv.dataset.ubicacion = ubicacionSelect.options[ubicacionSelect.selectedIndex].text;
      nuevoEventoDiv.dataset.nivel = tipoClaseSelect.options[tipoClaseSelect.selectedIndex].text;
      nuevoEventoDiv.dataset.profesor = document.getElementById('profesor-evento').options[document.getElementById('profesor-evento').selectedIndex].text;
      nuevoEventoDiv.dataset.estilo = document.getElementById('estilo-evento').options[document.getElementById('estilo-evento').selectedIndex].text;
    } else if (tipoEvento === 'actividad') {
      nuevoEventoDiv.dataset.tipo = 'Actividad';
      nuevoEventoDiv.dataset.tipoactividad = tipoActividadSelect.options[tipoActividadSelect.selectedIndex].text;
      if (document.getElementById('profesor-evento').value) {
        nuevoEventoDiv.dataset.profesor = document.getElementById('profesor-evento').options[document.getElementById('profesor-evento').selectedIndex].text;
      }
      if (bandaSelect.value) {
        nuevoEventoDiv.dataset.banda = bandaSelect.options[bandaSelect.selectedIndex].text;
      }
      if (descripcionInput.value) {
        nuevoEventoDiv.dataset.descripcion = descripcionInput.value;
      }
      nuevoEventoDiv.dataset.estilo = document.getElementById('estilo-evento').options[document.getElementById('estilo-evento').selectedIndex].text;
    }
    
    nuevoEventoDiv.innerHTML = `<strong>${nombreEvento}</strong>`;
    celdaDestino.appendChild(nuevoEventoDiv);

    const evento = new Evento();
    evento.tipo = nuevoEventoDiv.dataset.tipo.toLowerCase();
    evento.nombre = nuevoEventoDiv.dataset.nombre;
    evento.ubicacion = nuevoEventoDiv.dataset.ubicacion;
    evento.dia = nuevoEventoDiv.dataset.dia;
    evento.nivelClase = nuevoEventoDiv.dataset.nivel;
    evento.banda = nuevoEventoDiv.dataset.banda;
    evento.tipoActividad = nuevoEventoDiv.dataset.tipoactividad;
    evento.profesor = nuevoEventoDiv.dataset.profesor;
    evento.estilo = nuevoEventoDiv.dataset.estilo;
    evento.descripcionActividad = nuevoEventoDiv.dataset.descripcion;
    evento.hora = nuevoEventoDiv.dataset.hora;

    horario.agregarEvento(evento);

    form.reset();
    tipoEventoSelect.dispatchEvent(new Event('change'));
  });

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
      celdaOrigen.innerHTML = contenidoDestino;
      destino.innerHTML = contenidoOrigen;

      celdaOrigen.classList.remove("arrastrando");
      celdaOrigen = null;
    });

    celda.addEventListener("dragend", (e) => {
      e.currentTarget.classList.remove("arrastrando");
      celdaOrigen = null;
    });
  });

  const modal = document.getElementById('modal-evento');
  if (modal) {
    const cerrarModalBtn = document.getElementById('cerrar-modal');
    const contenedorTablas = document.querySelector('section#horario');

    const abrirModal = (eventoDiv) => {
      const datos = eventoDiv.dataset;

      document.getElementById('modal-nombre').textContent = datos.nombre || '';
      document.getElementById('modal-tipo-evento').textContent = datos.tipo || '';
      document.getElementById('modal-dia-evento').textContent = datos.dia || '';
      document.getElementById('modal-hora-evento').textContent = datos.hora || '';

      const campos = ['ubicacion', 'nivel', 'profesor', 'estilo', 'banda', 'tipo-actividad', 'descripcion'];
      campos.forEach(campo => {
        const pElement = document.getElementById(`modal-${campo}-evento`).parentElement;
        const dataKey = (campo === 'tipo-actividad') ? 'tipoactividad' : campo;

        if (datos[dataKey]) {
          document.getElementById(`modal-${campo}-evento`).textContent = datos[dataKey];
          pElement.style.display = 'block';
        } else {
          pElement.style.display = 'none';
        }
      });
      modal.classList.remove('oculto');
      modal.style.display = 'flex';
    };

    const cerrarModal = () => {
      modal.classList.add('oculto');
      modal.style.display = 'none';
    };

    contenedorTablas.addEventListener('click', (event) => {
      const eventoClicado = event.target.closest('.evento-registrado');
      if (eventoClicado) {
        abrirModal(eventoClicado);
      }
    });

    cerrarModalBtn.addEventListener('click', cerrarModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        cerrarModal();
      }
    });
  }
  horario.mostrarHorario();
});