import React, { useState } from 'react';
import AdminSidebar from '../admin/AdminSidebar';
import { MOCK_SOCIOS_LIST } from '../mocks/mockData';

const GestionSocios = () => {
  const [socios, setSocios] = useState(MOCK_SOCIOS_LIST);

  return (
    // Reemplazo: bg-dark-bg -> bg-gray-900
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">
        {/* Reemplazo: text-neon-green -> text-green-400 */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-green-400">
            👤 Gestión de Socios
        </h1>
        
        {/* Actions Bar */}
        {/* Reemplazo: bg-dark-card -> bg-gray-800 */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          {/* Reemplazo: bg-neon-purple -> bg-blue-400. text-dark-bg -> text-gray-900 */}
          <button className="w-full sm:w-auto px-6 py-3 mb-4 sm:mb-0 bg-blue-400 text-gray-900 font-bold rounded-lg hover:bg-blue-400/80 transition-colors shadow-md">
            + Registrar Nuevo Socio (Simulado)
          </button>
          {/* Reemplazo: focus:ring-neon-green -> focus:ring-green-400. focus:border-neon-green -> focus:border-green-400 */}
          <input 
            type="text" 
            placeholder="Buscar por Nombre/ID/Email..."
            className="p-3 border border-gray-700 bg-gray-700 text-white rounded-lg w-full sm:w-1/3 focus:ring-green-400 focus:border-green-400 transition-colors" 
          />
        </div>
        
        {/* Socios Table */}
        {/* Reemplazo: bg-dark-card -> bg-gray-800 */}
        <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              {/* Reemplazo: text-neon-green -> text-green-400 */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-gray-200">
              {socios.map(socio => (
                <tr key={socio.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{socio.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{socio.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{socio.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{socio.vencimiento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      // Reemplazo: bg-neon-green/20 -> bg-green-400/20. text-neon-green -> text-green-400
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                        ${socio.estado === 'Activa' ? 'bg-green-400/20 text-green-400' : 'bg-red-700/20 text-red-400'}`}
                    >
                      {socio.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* Reemplazo: text-neon-purple -> text-blue-400. hover:text-neon-green -> hover:text-green-400 */}
                    <button className="text-blue-400 hover:text-green-400 mr-4 transition-colors">Detalles</button>
                    {/* Reemplazo: text-neon-green -> text-green-400. hover:text-neon-purple -> hover:text-blue-400 */}
                    <button className="text-green-400 hover:text-blue-400 transition-colors">Renovar</button>
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