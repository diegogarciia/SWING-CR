import { Evento } from './evento.js';

export class Horario {

    constructor(eventos = []) {

        this.eventos = eventos; 

    }

    agregarEvento(evento) {

        this.eventos.push(evento);

        if (evento.tipo === 'clase') {

            console.log(`Clase agregada: ${evento.nombre} el día ${evento.dia} a las ${evento.hora}`);

        } else if (evento.tipo === 'actividad') {

            console.log(`Actividad agregada: ${evento.nombre} el día ${evento.dia} a las ${evento.hora}`);

        }
    }

    mostrarHorario() {

        console.log("Horario de todos los eventos:");

        this.eventos.forEach(evento => {

            evento.mostrarEvento();

        });
        
    }

}