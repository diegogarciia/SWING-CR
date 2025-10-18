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
  
  tipoEventoSelect.addEventListener('change', () => {
      if (tipoEventoSelect.value === 'actividad') {
          ubicacionSelect.disabled = true;
          ubicacionSelect.value = '';
      } else {
          ubicacionSelect.disabled = false;
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