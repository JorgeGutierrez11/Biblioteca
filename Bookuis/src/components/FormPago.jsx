import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllMultas } from '../api/book.api';
import { useAuth } from '../contexts/AuthContext';
import "../styles/FormPago.css";

const FormPago = () => {
  const [multas, setMultas] = useState([]);
  const { user } = useAuth();
  console.log(user)

  useEffect(() => {
    async function loadMultas() {
      if (!user || !user.id) {
        setMultas([]);
        return;
      }

      try {
        const allMultas = await getAllMultas();
        console.log("Datos obtenidos:", allMultas.data);

        if (allMultas?.data) {
          const res = allMultas.data.filter((multa) => multa.reserva.reserva.usuario === user.id);
          console.log("Multas filtradas:", res);
          setMultas(res);
        } else {
          console.warn("No se encontraron datos en la respuesta.");
          setMultas([]);
        }
      } catch (error) {
        console.error("Error al cargar las multas:", error);
      }
    }
    loadMultas();
  }, [user], []); 
console.log(multas)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
    alert(`¡Pago realizado con éxito para la multa: ${data.multas}!`);
  };

  return (
    <div className="form-pago-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-pago-card">
        <h2 className="form-pago-title">Pago de Multas</h2>

        {/* Multas pendientes */}
        <div className="form-group">
          <label htmlFor="multas">Multas pendientes</label>
          <select
            id="multas"
            {...register("multas", { required: "Selecciona una multa" })}
          >
            <option value="">Selecciona una multa</option>
            {multas.map((multa) => (
              <option value="multa1">{`Multa  - $${multa.monto} => ${multa.fecha_generada.slice(0, 10)}`}</option>
            ))}
          </select>
          {errors.multas && <p className="error-message">{errors.multas.message}</p>}
        </div>

        {/* Método de pago */}
        <div className="form-group">
          <label htmlFor="metodoPago">Método de pago</label>
          <select
            id="metodoPago"
            {...register("metodoPago", { required: "Selecciona un método de pago" })}
          >
            <option value="">Selecciona un método</option>
            <option value="tarjeta">Tarjeta de crédito</option>
            <option value="transferencia">Transferencia bancaria</option>
          </select>
          {errors.metodoPago && <p className="error-message">{errors.metodoPago.message}</p>}
        </div>

        {/* Información del usuario */}
        <div className="form-group">
          <label htmlFor="cedula">Cédula/NIT</label>
          <input
            type="text"
            id="cedula"
            placeholder="Ingresa tu Cédula o NIT"
            {...register("cedula", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números",
              },
            })}
          />
          {errors.cedula && <p className="error-message">{errors.cedula.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="nombres">Nombres y Apellidos</label>
          <input
            type="text"
            id="nombres"
            placeholder="Ej. Juan Pérez"
            {...register("nombres", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Solo se permiten letras",
              },
            })}
          />
          {errors.nombres && <p className="error-message">{errors.nombres.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            placeholder="Ej. 3101234567"
            {...register("telefono", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Debe tener 10 dígitos numéricos",
              },
            })}
          />
          {errors.telefono && <p className="error-message">{errors.telefono.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            placeholder="Ej. Calle 123 #45-67"
            {...register("direccion", { required: "Este campo es obligatorio" })}
          />
          {errors.direccion && <p className="error-message">{errors.direccion.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="total">Total a pagar</label>
          <input
            type="text"
            id="total"
            placeholder="Ej. 50000"
            {...register("total", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números",
              },
            })}
          />
          {errors.total && <p className="error-message">{errors.total.message}</p>}
        </div>

        {/* Botón de envío */}
        <button type="submit" className="form-pago-button">Pagar Ahora</button>
      </form>
    </div>
  );
};

export default FormPago;


