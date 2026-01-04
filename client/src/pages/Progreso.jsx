import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    Activity, Dumbbell, Utensils, Trophy, Calculator, 
    Plus, Trash2, TrendingUp, Calendar, ChevronRight, Apple, Target, X, Save
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// IMPORTAMOS TODAS LAS FUNCIONES DE LA API
import { 
    obtenerHistorialIMCRequest, 
    registrarIMCRequest,
    obtenerRutinasRequest,
    crearRutinaRequest,
    eliminarRutinaRequest,
    obtenerComidasHoyRequest,
    registrarComidaRequest
} from '../api/progreso';

const Progreso = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('calculadora');
    
    // --- ESTADOS ---
    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [historialIMC, setHistorialIMC] = useState([]);
    
    const [misRutinas, setMisRutinas] = useState([]);
    const [nivelUsuario, setNivelUsuario] = useState('principiante');
    const [diaRutina, setDiaRutina] = useState('Lunes');
    
    // ESTADO PARA EL MODAL DE CREAR RUTINA MANUAL
    const [showRutinaModal, setShowRutinaModal] = useState(false);
    const [manualRutina, setManualRutina] = useState({
        dia: 'Lunes',
        nombre: '',
        ejercicios: '', // Texto libre separado por comas
        nivel: 'Personalizado'
    });

    const [comidasHoy, setComidasHoy] = useState([]);
    const [nuevaComida, setNuevaComida] = useState({ nombre: '', cals: '', prot: '' });

    // Cargar datos al iniciar
    useEffect(() => {
        if (user) cargarDatos();
    }, [user, activeTab]);

    const cargarDatos = async () => {
        if (!user) return;
        const uid = user.id_usuario || user.id;
        try {
            if (activeTab === 'calculadora') setHistorialIMC(await obtenerHistorialIMCRequest(uid) || []);
            if (activeTab === 'rutinas') setMisRutinas(await obtenerRutinasRequest(uid) || []);
            if (activeTab === 'nutricion') setComidasHoy(await obtenerComidasHoyRequest(uid) || []);
        } catch (error) { console.error("Error:", error); }
    };

    // --- 1. CALCULADORA IMC ---
    const calcularYGuardarIMC = async () => {
        if (!altura || !peso) return addToast('Faltan datos', 'error');
        const imcCalculado = (peso / ((altura/100)**2)).toFixed(1);
        const uid = user.id_usuario || user.id;
        try {
            await registrarIMCRequest({ id_usuario: uid, peso, altura, imc: imcCalculado });
            addToast(`IMC: ${imcCalculado} registrado`, 'success');
            setAltura(''); setPeso(''); cargarDatos();
        } catch (error) { addToast('Error al guardar IMC', 'error'); }
    };

    // --- 2. RUTINAS (IA & MANUAL) ---
    
    // A) Generador Automático (IA Simulada)
    const generarRutinaAutomatica = async () => {
        const uid = user.id_usuario || user.id;
        let ejerciciosGenerados = '';
        let nombreRutina = '';
        if (nivelUsuario === 'principiante') {
            nombreRutina = 'Full Body (Adaptación)';
            ejerciciosGenerados = 'Sentadillas 3x12, Flexiones 3x10, Remo con mancuerna 3x12, Plancha 3x30seg';
        } else if (nivelUsuario === 'intermedio') {
            nombreRutina = diaRutina === 'Lunes' ? 'Torso Fuerza' : 'Pierna Hipertrofia';
            ejerciciosGenerados = diaRutina === 'Lunes' ? 'Press Banca 4x8, Dominadas 4xMax, Press Militar 3x10' : 'Sentadilla Búlgara 3x10, Peso Muerto Rumano 4x10, Prensa 3x15';
        } else {
            nombreRutina = 'Push/Pull/Legs (Avanzado)';
            ejerciciosGenerados = 'Press Inclinado 4x8, Aperturas 3x12, Tríceps Copa 4x12, Elevaciones Laterales 4x15';
        }
        try {
            await crearRutinaRequest({ id_usuario: uid, dia_semana: diaRutina, nombre_rutina: nombreRutina, ejercicios: ejerciciosGenerados, nivel: nivelUsuario });
            addToast('Rutina generada exitosamente', 'success'); cargarDatos();
        } catch (error) { addToast('Error al crear rutina', 'error'); }
    };

    // B) Creador Manual (Formulario Modal)
    const crearRutinaManual = async (e) => {
        e.preventDefault();
        const uid = user.id_usuario || user.id;
        try {
            await crearRutinaRequest({ 
                id_usuario: uid, 
                dia_semana: manualRutina.dia, 
                nombre_rutina: manualRutina.nombre, 
                ejercicios: manualRutina.ejercicios, 
                nivel: manualRutina.nivel 
            });
            addToast('Rutina creada correctamente', 'success');
            setShowRutinaModal(false);
            setManualRutina({ dia: 'Lunes', nombre: '', ejercicios: '', nivel: 'Personalizado' }); // Reset
            cargarDatos();
        } catch (error) { addToast('Error al guardar rutina', 'error'); }
    };

    const eliminarRutina = async (id) => {
        try { await eliminarRutinaRequest(id); addToast('Rutina eliminada', 'info'); cargarDatos(); } catch (error) { addToast('Error al eliminar', 'error'); }
    };

    // --- 3. NUTRICIÓN ---
    const agregarComida = async (e) => {
        e.preventDefault();
        const uid = user.id_usuario || user.id;
        try {
            await registrarComidaRequest({ id_usuario: uid, nombre_comida: nuevaComida.nombre, calorias: nuevaComida.cals, proteinas: nuevaComida.prot });
            setNuevaComida({ nombre: '', cals: '', prot: '' }); addToast('Comida registrada', 'success'); cargarDatos();
        } catch (error) { addToast('Error al registrar comida', 'error'); }
    };

    const totalCals = comidasHoy.reduce((acc, curr) => acc + (parseInt(curr.calorias) || 0), 0);
    const totalProt = comidasHoy.reduce((acc, curr) => acc + (parseInt(curr.proteinas) || 0), 0);

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Mi <span className="text-purple-600 bg-purple-50 px-2 rounded-lg">Progreso</span></h1>
                    <p className="text-neutral-500 mt-2 text-lg font-medium">Monitorea tu evolución, crea rutinas y cumple tus metas.</p>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-3 mb-10 pb-2 scrollbar-hide">
                    <TabButton icon={Calculator} label="IMC & Historial" active={activeTab === 'calculadora'} onClick={() => setActiveTab('calculadora')} />
                    <TabButton icon={Dumbbell} label="Mis Rutinas" active={activeTab === 'rutinas'} onClick={() => setActiveTab('rutinas')} />
                    <TabButton icon={Utensils} label="Nutrición" active={activeTab === 'nutricion'} onClick={() => setActiveTab('nutricion')} />
                    <TabButton icon={Trophy} label="Logros" active={activeTab === 'logros'} onClick={() => setActiveTab('logros')} />
                </div>

                {/* TAB 1: CALCULADORA (Código igual al anterior, resumido aquí) */}
                {activeTab === 'calculadora' && (
                    <div className="grid md:grid-cols-12 gap-8 animate-fade-in-up">
                        <div className="md:col-span-5 bg-white p-8 rounded-[32px] shadow-xl shadow-purple-100/50 border border-neutral-100 h-fit sticky top-8">
                            <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-purple-600"><Activity size={24} /></div>
                            <h3 className="font-bold text-2xl text-neutral-900 mb-6">Calculadora IMC</h3>
                            <div className="space-y-5">
                                <input type="number" placeholder="Altura (cm)" value={altura} onChange={e=>setAltura(e.target.value)} className="w-full p-4 bg-neutral-50 rounded-2xl outline-none font-bold text-lg" />
                                <input type="number" placeholder="Peso (kg)" value={peso} onChange={e=>setPeso(e.target.value)} className="w-full p-4 bg-neutral-50 rounded-2xl outline-none font-bold text-lg" />
                                <button onClick={calcularYGuardarIMC} className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2"><Calculator size={20} /> Calcular y Registrar</button>
                            </div>
                        </div>
                        <div className="md:col-span-7 space-y-6">
                            <h3 className="font-bold text-xl text-neutral-900 flex items-center gap-2"><TrendingUp className="text-green-500"/> Historial</h3>
                            {historialIMC.map((reg, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-neutral-100 p-3 rounded-2xl text-neutral-500"><Calendar size={20} /></div>
                                        <div><p className="font-black text-xl text-neutral-800">{reg.peso} <span className="text-sm text-neutral-400 font-medium">kg</span></p><p className="text-xs text-neutral-400 font-medium">{new Date(reg.fecha).toLocaleDateString()}</p></div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${reg.imc > 25 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>IMC: {reg.imc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================= TAB 2: RUTINAS (AUTOGENERAR O MANUAL) ================= */}
                {activeTab === 'rutinas' && (
                    <div className="space-y-10 animate-fade-in-up">
                        
                        {/* OPCIONES DE CREACIÓN */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Card Generador IA */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-purple-900 rounded-[32px] p-8 text-white shadow-2xl shadow-purple-900/20 flex flex-col justify-between">
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-purple-200 mb-4 border border-white/10"><Target size={14} /> ENTRENA+ AI</div>
                                    <h3 className="text-2xl font-black mb-2">Generar Rutina</h3>
                                    <p className="text-neutral-300 mb-6 text-sm">Deja que nuestro algoritmo diseñe un plan para ti.</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <select value={nivelUsuario} onChange={e=>setNivelUsuario(e.target.value)} className="bg-white/10 border border-white/10 text-white rounded-xl p-3 text-sm font-bold outline-none"><option value="principiante" className="text-black">Principiante</option><option value="intermedio" className="text-black">Intermedio</option><option value="avanzado" className="text-black">Avanzado</option></select>
                                            <select value={diaRutina} onChange={e=>setDiaRutina(e.target.value)} className="bg-white/10 border border-white/10 text-white rounded-xl p-3 text-sm font-bold outline-none">{['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d=><option key={d} value={d} className="text-black">{d}</option>)}</select>
                                        </div>
                                        <button onClick={generarRutinaAutomatica} className="w-full bg-white text-neutral-900 py-3 rounded-xl font-black hover:bg-purple-600 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"><Activity size={18} /> Generar Automáticamente</button>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/30 blur-[80px] rounded-full mix-blend-overlay"></div>
                            </div>

                            {/* Card Crear Manual */}
                            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center items-center text-center cursor-pointer group" onClick={() => setShowRutinaModal(true)}>
                                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Plus size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 mb-2">Crear Manualmente</h3>
                                <p className="text-neutral-500 text-sm max-w-xs">Diseña tu propia rutina desde cero. Tú eliges los ejercicios y repeticiones.</p>
                            </div>
                        </div>

                        {/* Lista de Rutinas */}
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">Mis Rutinas Activas <span className="bg-neutral-200 text-neutral-600 text-xs px-2 py-1 rounded-md">{misRutinas.length}</span></h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {misRutinas.map(rutina => (
                                    <div key={rutina.id} className="group bg-white p-6 rounded-[32px] shadow-sm border border-neutral-100 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all relative">
                                        <button onClick={() => eliminarRutina(rutina.id)} className="absolute top-4 right-4 p-2 bg-neutral-50 rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                        <div className="mb-4"><span className="bg-purple-100 text-purple-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">{rutina.dia_semana}</span></div>
                                        <h4 className="font-black text-xl text-neutral-900 mb-2">{rutina.nombre_rutina}</h4>
                                        <p className="text-xs font-bold text-neutral-400 mb-6 flex items-center gap-1"><Target size={12} /> {rutina.nivel.toUpperCase()}</p>
                                        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                                            <ul className="text-sm text-neutral-600 space-y-3">
                                                {rutina.ejercicios && rutina.ejercicios.split(',').map((ex, i) => (
                                                    <li key={i} className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0"></div><span className="leading-tight font-medium">{ex.trim()}</span></li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3 Y 4 (Nutrición y Logros)  */}
                {activeTab === 'nutricion' && (
                    <div className="grid lg:grid-cols-12 gap-8 animate-fade-in-up">
                        {/* ... Código de Nutrición igual al anterior ... */}
                        <div className="lg:col-span-4 h-fit">
                            <div className="bg-white p-8 rounded-[32px] shadow-lg shadow-green-100/50 border border-neutral-100 sticky top-8">
                                <h3 className="font-bold text-2xl text-neutral-900 mb-6">Registrar Comida</h3>
                                <form onSubmit={agregarComida} className="space-y-4">
                                    <input required type="text" placeholder="Ej: Pollo" value={nuevaComida.nombre} onChange={e=>setNuevaComida({...nuevaComida, nombre: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none font-medium transition-all" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required type="number" placeholder="Kcal" value={nuevaComida.cals} onChange={e=>setNuevaComida({...nuevaComida, cals: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none font-bold text-center" />
                                        <input required type="number" placeholder="Prot" value={nuevaComida.prot} onChange={e=>setNuevaComida({...nuevaComida, prot: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none font-bold text-center" />
                                    </div>
                                    <button type="submit" className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"><Plus size={20} /> Añadir</button>
                                </form>
                            </div>
                        </div>
                        <div className="lg:col-span-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-purple-900 to-emerald-600 p-6 rounded-[32px] text-white shadow-lg"><p className="text-5xl font-black">{totalCals}</p><p className="text-sm font-medium opacity-80">kcal consumidas</p></div>
                                <div className="bg-gradient-to-br from-green-500 to-purple-900 p-6 rounded-[32px] text-white shadow-lg"><p className="text-5xl font-black">{totalProt}</p><p className="text-sm font-medium opacity-80">gramos prot</p></div>
                            </div>
                            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden">
                                {comidasHoy.map((c, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 border-b border-neutral-50">
                                        <span className="font-bold text-lg text-neutral-700 capitalize">{c.nombre_comida}</span>
                                        <div className="text-right"><span className="block font-black text-neutral-900">{c.calorias} kcal</span><span className="block font-bold text-blue-600 text-sm">{c.proteinas}g prot</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'logros' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                        {[
                            { title: 'Primeros Pasos', desc: 'Crea tu primera rutina', unlocked: misRutinas.length > 0 },
                            { title: 'Nutricionista', desc: 'Registra tu primera comida', unlocked: comidasHoy.length > 0 },
                            { title: 'Constancia', desc: 'Registra 3 veces tu IMC', unlocked: historialIMC.length >= 3 },
                            { title: 'Bestia', desc: 'Nivel Avanzado alcanzado', unlocked: false },
                        ].map((logro, i) => (
                            <div key={i} className={`p-8 rounded-[32px] border-2 transition-all ${logro.unlocked ? 'bg-white border-purple-200 shadow-xl' : 'bg-neutral-50 border-neutral-100 opacity-60 grayscale'}`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${logro.unlocked ? 'bg-purple-500 text-white' : 'bg-neutral-200 text-neutral-400'}`}><Trophy size={28} /></div>
                                <h4 className="font-black text-xl text-neutral-900 mb-2">{logro.title}</h4>
                                <p className="text-sm text-neutral-500 font-medium">{logro.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* --- MODAL PARA CREAR RUTINA MANUAL --- */}
            {showRutinaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-neutral-900">Nueva Rutina</h3>
                            <button onClick={() => setShowRutinaModal(false)} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X size={20}/></button>
                        </div>
                        <form onSubmit={crearRutinaManual} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase ml-1 mb-1 block">Día</label>
                                <select value={manualRutina.dia} onChange={e=>setManualRutina({...manualRutina, dia: e.target.value})} 
                                    className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none font-bold">
                                    {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d=><option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase ml-1 mb-1 block">Nombre Rutina</label>
                                <input type="text" placeholder="Ej: Pecho y Tríceps" value={manualRutina.nombre} onChange={e=>setManualRutina({...manualRutina, nombre: e.target.value})} required
                                    className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none font-bold" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase ml-1 mb-1 block">Ejercicios (Separados por coma)</label>
                                <textarea placeholder="Ej: Press Banca 4x10, Aperturas 3x12, Fondos 3xMax..." value={manualRutina.ejercicios} onChange={e=>setManualRutina({...manualRutina, ejercicios: e.target.value})} required
                                    className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none font-medium h-32 resize-none" />
                            </div>
                            <button type="submit" className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2">
                                <Save size={20} /> Guardar Rutina
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

// Componente TabButton 
const TabButton = ({ icon: Icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border ${active ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl scale-105' : 'bg-white text-neutral-500 border-transparent hover:bg-neutral-50'}`}>
        <Icon size={20} className={active ? "text-purple-400" : "text-neutral-400"} /> <span className="whitespace-nowrap">{label}</span>
    </button>
);

// Icono flama 
const FlameIcon = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);

export default Progreso;