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