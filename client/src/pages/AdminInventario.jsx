import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Box, PenTool, X, Check, Filter } from 'lucide-react';
import { obtenerInventarioAdmin, crearItemInventario, actualizarItemInventario, eliminarItemInventario } from '../api/admin';
import { useToast } from '../context/ToastContext';

const AdminInventario = () => {
    const { addToast } = useToast();
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    
    // Estado Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        nombre: '', categoria: 'General', cantidad: 1, estado: 'Operativo', ubicacion: '', descripcion: ''
    });

    const cargarInventario = () => {
        setLoading(true);
        obtenerInventarioAdmin()
            .then(data => { setInventario(data || []); setLoading(false); })
            .catch(() => { addToast('Error cargando datos', 'error'); setLoading(false); });
    };

    useEffect(() => { cargarInventario(); }, []);

    // --- MANEJADORES ---
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await actualizarItemInventario(currentItem.id, currentItem);
                addToast('Ítem actualizado', 'success');
            } else {
                await crearItemInventario(currentItem);
                addToast('Ítem agregado al inventario', 'success');
            }
            setIsModalOpen(false);
            cargarInventario();
        } catch (error) {
            addToast('Error al guardar', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este ítem?")) return;
        try {
            await eliminarItemInventario(id);
            addToast('Eliminado correctamente', 'success');
            cargarInventario();
        } catch (error) { addToast('Error al eliminar', 'error'); }
    };

    const openCreate = () => {
        setIsEditing(false);
        setCurrentItem({ nombre: '', categoria: 'General', cantidad: 1, estado: 'Operativo', ubicacion: '', descripcion: '' });
        setIsModalOpen(true);
    };

    const openEdit = (item) => {
        setIsEditing(true);
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    // --- FILTRADO ---
    const filtrados = inventario.filter(item => 
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Control de Inventario</h1>
                    <p className="text-gray-500">Administra máquinas, accesorios y suministros.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input 
                            type="text" placeholder="Buscar ítem..." 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                            value={busqueda} onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                    <button onClick={openCreate} className="bg-purple-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg flex items-center gap-2">
                        <Plus size={20}/> <span className="hidden sm:inline">Nuevo Ítem</span>
                    </button>
                </div>
            </header>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Ítem</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Ubicación</th>
                            <th className="p-4 text-center">Cantidad</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtrados.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-bold text-gray-900">{item.nombre}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.descripcion}</p>
                                </td>
                                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{item.categoria}</span></td>
                                <td className="p-4 text-sm text-gray-600">{item.ubicacion || '-'}</td>
                                <td className="p-4 text-center font-bold">{item.cantidad}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit gap-1 items-center
                                        ${item.estado === 'Operativo' || item.estado === 'Nuevo' ? 'bg-green-100 text-green-700' : 
                                          item.estado === 'Dañado' || item.estado === 'Baja' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                                    `}>
                                        <div className={`w-2 h-2 rounded-full ${item.estado === 'Operativo' ? 'bg-green-500' : 'bg-current'}`}></div>
                                        {item.estado}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={18}/></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtrados.length === 0 && !loading && (
                    <div className="p-10 text-center text-gray-400">No hay ítems registrados.</div>
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{isEditing ? 'Editar Ítem' : 'Registrar Nuevo Ítem'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                                <input required className="w-full border rounded-lg p-3 mt-1" value={currentItem.nombre} onChange={e => setCurrentItem({...currentItem, nombre: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                                <select className="w-full border rounded-lg p-3 mt-1 bg-white" value={currentItem.categoria} onChange={e => setCurrentItem({...currentItem, categoria: e.target.value})}>
                                    <option>General</option>
                                    <option>Maquinaria</option>
                                    <option>Pesas / Mancuernas</option>
                                    <option>Electrónica</option>
                                    <option>Mobiliario</option>
                                    <option>Limpieza</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
                                <select className="w-full border rounded-lg p-3 mt-1 bg-white" value={currentItem.estado} onChange={e => setCurrentItem({...currentItem, estado: e.target.value})}>
                                    <option>Operativo</option>
                                    <option>Nuevo</option>
                                    <option>En Reparación</option>
                                    <option>Dañado</option>
                                    <option>Baja (Descarte)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Cantidad</label>
                                <input type="number" min="1" className="w-full border rounded-lg p-3 mt-1" value={currentItem.cantidad} onChange={e => setCurrentItem({...currentItem, cantidad: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Ubicación</label>
                                <input className="w-full border rounded-lg p-3 mt-1" placeholder="Ej: Sala 1" value={currentItem.ubicacion} onChange={e => setCurrentItem({...currentItem, ubicacion: e.target.value})} />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Descripción / Detalles</label>
                                <textarea className="w-full border rounded-lg p-3 mt-1 h-20" placeholder="Marca, modelo, serie..." value={currentItem.descripcion} onChange={e => setCurrentItem({...currentItem, descripcion: e.target.value})} />
                            </div>

                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center gap-2">
                                    <Check size={18}/> Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventario;