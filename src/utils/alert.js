// src/utils/alert.js
import Swal from "sweetalert2";

export const alertSuccess = (msg) => Swal.fire({ title: "Éxito", text: msg, icon: "success" });
export const alertError = (msg) => Swal.fire({ title: "Error", text: msg, icon: "error" });
export const alertInfo = (msg) => Swal.fire({ title: "Info", text: msg, icon: "info" });
export const alertConfirm = (msg) => Swal.fire({
    title: "Confirmar",
    text: msg,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar"
});
