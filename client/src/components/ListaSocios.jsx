import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaSocios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        // Asumiendo que el backend se ejecuta en el puerto 5000
        const res = await axios.get('http://localhost:5000/api/v1/socios');
        setSocios(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la lista de socios.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchSocios();
  }, []);

  if (loading) return <p>Cargando datos de socios...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="container-administrador">
      <h2>📊 Gestión de Socios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map(socio => (
            <tr key={socio.socio_id}>
              <td>{socio.socio_id}</td>
              <td>{socio.nombre}</td>
              <td>{socio.email}</td>
              <td>{socio.telefono}</td>
              <td>{new Date(socio.fecha_vencimiento).toLocaleDateString()}</td>
              <td style={{ color: socio.estado_membresia === 'Activa' ? 'green' : 'red' }}>
                **{socio.estado_membresia}**
              </td>
              <td><button>Ver Detalles</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>+ Registrar Nuevo Socio</button>
    </div>
  );
};

export default ListaSocios;