import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, ShieldCheck, ShieldAlert } from 'lucide-react';
// Importar tu función de API para obtener socios
import { obtenerTodosSociosRequest } from '../api/usuarios'; 

const StaffSocios = () => {
    const [socios, setSocios] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetchSocios = async () => {
            const data = await obtenerTodosSociosRequest();
            setSocios(data || []);
        };
        fetchSocios();
    }, []);

    const filtrados = socios.filter(s => 
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        s.email.toLowerCase().includes(busqueda.toLowerCase())
    );
    

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Directorio de Socios</h1>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3 text-neutral-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o correo..." 
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-purple-500 outline-none"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {filtrados.map(socio => (
                        <div key={socio.id_usuario}> {/* Usamos id_usuario como PK real */}
                            {/* ... */}
                            <div className="text-center">
                                <p className="text-[10px] text-neutral-400 uppercase font-bold">Estado</p>
                                <span className={`text-sm font-bold ${
                                    socio.estado_suscripcion === 'activa' ? 'text-green-600' : 'text-red-500'
                                }`}>
                                    {socio.membresia_tipo} {/* Columna real de la DB */}
                                </span>
                                {/* Validamos vigencia con membresia_fin */}
                                <p className="text-[9px] text-neutral-400">Vence: {new Date(socio.membresia_fin).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="flex gap-2">
                                {/* El contacto se toma de 'telefono' de la tabla usuarios */}
                                <a href={`tel:${socio.telefono}`} className="p-3 bg-neutral-50 text-neutral-600 rounded-xl hover:bg-purple-50">
                                    <Phone size={18} />
                                </a>
                                {/* Botón para ver datos de emergencia: contacto_emergencia_nombre */}
                                <button className="p-3 bg-neutral-900 text-white rounded-xl text-xs font-bold">
                                    Ficha Salud
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffSocios;