export class Evento {

    tipo = "";
    nombre = "";
    ubicacion = "";
    dia = "";
    nivelClase = "";
    banda = "";
    tipoActividad = "";
    profesor = "";
    estilo = "";
    descripcionActividad = "";
    hora = "";
    
    constructor(tipo, nombre, dia, nivelClase, banda, tipoActividad, profesor, estilo, descripcionActividad, hora) {

        this.tipo = tipo;
        this.nombre = nombre;
        this.dia = dia;
        this.nivelClase = nivelClase;
        this.banda = banda;
        this.tipoActividad = tipoActividad;
        this.profesor = profesor;
        this.estilo = estilo;
        this.descripcionActividad = descripcionActividad;
        this.hora = hora;
        
    }

    mostrarEvento() {

        if (this.tipo === "clase") {

            console.log(`Evento de clase -> Nombre: ${this.nombre} - Ubicación: ${this.ubicacion} - Día: ${this.dia} - Nivel: ${this.nivelClase} - Profesor: ${this.profesor} - Estilo: ${this.estilo} - Hora: ${this.hora}`);

        } else if (this.tipo === "actividad") {

            console.log(`Evento de actividad -> Nombre: ${this.nombre} - Día: ${this.dia} - Banda: ${this.banda} - Tipo de actividad: ${this.tipoActividad} - Profesor: ${this.profesor} - Estilo: ${this.estilo} - Descripción: ${this.descripcionActividad} - Hora: ${this.hora}`);

        }

    }

}