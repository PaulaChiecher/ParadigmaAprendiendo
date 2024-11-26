"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
// menu.ts: Gestión de la interacción con el usuario utilizando readline-sync
const readlineSync = __importStar(require("readline-sync"));
class Menu {
    constructor(listaDeTareas) {
        this.listaDeTareas = listaDeTareas; // Asigna la lista de tareas proporcionada al menú
    }
    // Muestra el menú principal y procesa la opción seleccionada
    mostrarMenu() {
        const logs = []; // Arreglo para registrar las acciones realizadas
        logs.push("--- Menú de Tareas ---");
        logs.push("1. Mostrar tareas");
        logs.push("2. Agregar tarea");
        logs.push("3. Modificar tarea");
        logs.push("4. Eliminar tarea");
        logs.push("5. Salir");
        console.log(logs.join("\n")); // Muestra las opciones del menú principal
        const opcion = readlineSync.questionInt("\nSeleccione una opcion: "); // Solicita una opción al usuario
        logs.push(this.ejecutarOpcion(opcion)); // Ejecuta la opción seleccionada y guarda el resultado en los logs
        return logs; // Devuelve los registros de las acciones realizadas
    }
    // Ejecuta la opción seleccionada en el menú principal
    ejecutarOpcion(opcion) {
        switch (opcion) {
            case 1:
                return this.mostrarTareas(); // Muestra el submenú de tareas
            case 2:
                return this.agregarTarea(); // Agrega una nueva tarea
            case 3:
                return this.modificarTarea(); // Modifica una tarea existente
            case 4:
                return this.eliminarTarea(); // Elimina una tarea existente
            case 5:
                return "Hasta luego!"; // Finaliza el programa
            default:
                return "Opción inválida. Intente nuevamente."; // Maneja opciones inválidas
        }
    }
    // Muestra el submenú para visualizar tareas y procesa la opción seleccionada
    mostrarTareas() {
        const logs = [];
        logs.push("--- Submenú de Mostrar Tareas ---");
        logs.push("1. Mostrar todas las tareas");
        logs.push("2. Mostrar tareas pendientes");
        logs.push("3. Mostrar tareas en curso");
        logs.push("4. Mostrar tareas terminadas");
        console.log(logs.join("\n")); // Muestra las opciones del submenú
        const opcion = readlineSync.questionInt("\nSeleccione una opcion: "); // Solicita una opción al usuario
        switch (opcion) {
            case 1:
                // Muestra todas las tareas o indica si no hay disponibles
                return this.listaDeTareas.obtenerTareas().map((tarea) => tarea.mostrarDetalles()).join("\n") || "No hay tareas disponibles.";
            case 2:
                // Muestra las tareas pendientes
                return this.listaDeTareas.obtenerTareasPorEstado("pendiente").map((tarea) => tarea.mostrarDetalles()).join("\n") || "No hay tareas pendientes.";
            case 3:
                // Muestra las tareas en curso
                return this.listaDeTareas.obtenerTareasPorEstado("en curso").map((tarea) => tarea.mostrarDetalles()).join("\n") || "No hay tareas en curso.";
            case 4:
                // Muestra las tareas terminadas
                return this.listaDeTareas.obtenerTareasPorEstado("terminada").map((tarea) => tarea.mostrarDetalles()).join("\n") || "No hay tareas terminadas.";
            default:
                return "Opción inválida. Intente nuevamente."; // Maneja opciones inválidas
        }
    }
    // Solicita los datos para agregar una nueva tarea y la agrega a la lista
    agregarTarea() {
        const titulo = this.capturarTexto("Ingrese el titulo de la tarea: "); // Solicita el título
        const descripcion = this.capturarTexto("Ingrese la descripcion de la tarea: "); // Solicita la descripción
        const estado = this.solicitarEstado(); // Solicita el estado (pendiente, en curso, terminada)
        const dificultad = readlineSync.questionInt("Ingrese la dificultad de la tarea (1-5): "); // Solicita la dificultad
        const vencimiento = readlineSync.keyInYNStrict("¿Tiene vencimiento? (Y/N)")
            ? new Date(this.capturarTexto("Ingrese la fecha de vencimiento (YYYY-MM-DD): ")) // Solicita la fecha de vencimiento si aplica
            : null;
        // Agrega la tarea a la lista y devuelve el mensaje de confirmación
        return this.listaDeTareas.agregarTarea(titulo, descripcion, estado, vencimiento, dificultad);
    }
    // Solicita los datos para modificar una tarea existente
    // Solicita los datos para modificar una tarea existente
    modificarTarea() {
        console.log("Tareas disponibles:");
        // Muestra todas las tareas disponibles
        console.log(this.listaDeTareas.obtenerTareas().map((tarea) => tarea.mostrarDetalles()).join("\n"));
        const id = readlineSync.questionInt("Ingrese el ID de la tarea que desea modificar: "); // Solicita el ID de la tarea
        // Verifica si el ID existe antes de solicitar los nuevos datos
        const tareaExiste = this.listaDeTareas.obtenerTareas().some((tarea) => tarea.id === id);
        if (!tareaExiste) {
            return `No se encontró ninguna tarea con el ID "${id}".`; // Devuelve un mensaje si el ID no existe
        }
        // Si el ID es válido, solicita los nuevos datos para modificar
        const nuevosDatos = {};
        if (readlineSync.keyInYNStrict("¿Quiere cambiar el título?")) {
            nuevosDatos.titulo = this.capturarTexto("Nuevo título: "); // Solicita el nuevo título
        }
        if (readlineSync.keyInYNStrict("¿Quiere cambiar la descripción?")) {
            nuevosDatos.descripcion = this.capturarTexto("Nueva descripción: "); // Solicita la nueva descripción
        }
        if (readlineSync.keyInYNStrict("¿Quiere cambiar el estado?")) {
            nuevosDatos.estado = this.solicitarEstado(); // Solicita el nuevo estado
        }
        if (readlineSync.keyInYNStrict("¿Quiere cambiar la dificultad?")) {
            nuevosDatos.dificultad = readlineSync.questionInt("Nueva dificultad (1-5): "); // Solicita la nueva dificultad
        }
        if (readlineSync.keyInYNStrict("¿Quiere cambiar la fecha de vencimiento?")) {
            nuevosDatos.vencimiento = new Date(this.capturarTexto("Nueva fecha de vencimiento (YYYY-MM-DD): ")); // Solicita la nueva fecha de vencimiento
        }
        // Modifica la tarea y devuelve el mensaje de confirmación
        return this.listaDeTareas.modificarTarea(id, nuevosDatos);
    }
    // Solicita el ID de una tarea y la elimina de la lista
    eliminarTarea() {
        console.log("Tareas disponibles:");
        // Muestra todas las tareas disponibles
        console.log(this.listaDeTareas.obtenerTareas().map((tarea) => tarea.mostrarDetalles()).join("\n"));
        const id = readlineSync.questionInt("Ingrese el ID de la tarea que desea eliminar: "); // Solicita el ID de la tarea
        return this.listaDeTareas.eliminarTarea(id); // Elimina la tarea y devuelve el mensaje de confirmación
    }
    // Solicita al usuario un texto basado en el mensaje proporcionado
    capturarTexto(prompt) {
        return readlineSync.question(prompt);
    }
    // Solicita al usuario un estado válido y lo devuelve
    solicitarEstado() {
        let estado;
        do {
            estado = this.capturarTexto("Ingrese el estado de la tarea (p: Pendiente, c: En curso, t: Terminada): ").toLowerCase();
        } while (!["p", "c", "t"].includes(estado)); // Valida que el estado sea una de las opciones permitidas
        // Convierte la entrada a su representación completa
        return estado === "p" ? "pendiente" : estado === "c" ? "en curso" : "terminada";
    }
}
exports.Menu = Menu;
