import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { MOCK_SOCIOS_LIST } from '../mocks/mockData';

const GestionSocios = () => {
  const [socios, setSocios] = useState(MOCK_SOCIOS_LIST);

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-green">
            👤 Gestión de Socios
        </h1>
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-dark-card rounded-xl shadow-lg border border-gray-700">
          <button className="w-full sm:w-auto px-6 py-3 mb-4 sm:mb-0 bg-neon-purple text-dark-bg font-bold rounded-lg hover:bg-neon-purple/80 transition-colors shadow-md">
            + Registrar Nuevo Socio (Simulado)
          </button>
          <input 
            type="text" 
            placeholder="Buscar por Nombre/ID/Email..."
            className="p-3 border border-gray-700 bg-gray-800 text-white rounded-lg w-full sm:w-1/3 focus:ring-neon-green focus:border-neon-green transition-colors" 
          />
        </div>
        
        {/* Socios Table */}
        <div className="overflow-x-auto bg-dark-card rounded-xl shadow-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-green uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {socios.map(socio => (
                <tr key={socio.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{socio.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{socio.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{socio.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{socio.vencimiento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                        ${socio.estado === 'Activa' ? 'bg-neon-green/20 text-neon-green' : 'bg-red-700/20 text-red-400'}`}
                    >
                      {socio.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-neon-purple hover:text-neon-green mr-4 transition-colors">Detalles</button>
                    <button className="text-neon-green hover:text-neon-purple transition-colors">Renovar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GestionSocios;