import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    Dumbbell, Timer, Users, Play, 
    CheckCircle2, XCircle, ArrowRight, Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { 
    obtenerMaquinasRequest, 
    obtenerMiTurnoRequest, 
    unirseFilaRequest, 
    finalizarTurnoRequest, 
    abandonarFilaRequest 
} from '../api/reservas';

const Reservaciones = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    
    const [maquinas, setMaquinas] = useState([]);
    const [miTurno, setMiTurno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorServer, setErrorServer] = useState(false);
    
    const userId = user?.id_usuario || user?.id;

// Dentro de fetchData en Reservaciones.jsx:
const fetchData = async () => {
    if (!userId) return;
    try {
        const dataMaquinas = await obtenerMaquinasRequest();
        
        // SEGURIDAD: Solo setear si es un Array real
        if (Array.isArray(dataMaquinas)) {
            setMaquinas(dataMaquinas);
        } else {
            setMaquinas([]); 
        }

        const dataTurno = await obtenerMiTurnoRequest(userId);
        
        // El backend devuelve null si no hay turno, lo manejamos:
        if (dataTurno && !dataTurno.error) {
            setMiTurno(dataTurno);
        } else {
            setMiTurno(null);
        }

    } catch (error) {
        console.error("Error en reservaciones:", error);
        setMaquinas([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Polling cada 5s
        return () => clearInterval(interval);
    }, [userId]);

    // --- ACCIONES ---

    const unirseAFila = async (maquina) => {
        if (miTurno) {
            addToast("Ya tienes una reservación activa", "error");
            return;
        }
        try {
            await unirseFilaRequest({
                id_maquina: maquina.id,
                id_usuario: userId,
                estado: maquina.estaOcupada ? 'esperando' : 'usando'
            });
            addToast(maquina.estaOcupada ? "Te has unido a la fila" : "Puedes usar la máquina ahora", "success");
            fetchData();
        } catch (error) {
            addToast("Error al unirse a la fila", "error");
        }
    };

    const finalizarUso = async () => {
        try {
            await finalizarTurnoRequest({
                id_turno: miTurno.id,
                id_maquina: miTurno.id_maquina
            });
            addToast("Entrenamiento finalizado", "success");
            setMiTurno(null);
            fetchData();
        } catch (error) {
            addToast("Error al finalizar", "error");
        }
    };

    const abandonarFila = async () => {
        try {
            await abandonarFilaRequest(miTurno.id);
            addToast("Fila abandonada", "info");
            setMiTurno(null);
            fetchData();
        } catch (error) {
            addToast("Error al salir", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-neutral-500">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-bold">Cargando gimnasio...</p>
        </div>
    );

    if (errorServer) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="bg-red-50 p-6 rounded-full text-red-500"><AlertCircle size={48}/></div>
            <h2 className="text-xl font-black text-gray-900">Sin conexión al servidor</h2>
            <p className="text-gray-500 max-w-md">No pudimos cargar el estado del gimnasio. Verifica que el servidor (backend) esté encendido.</p>
            <button onClick={fetchData} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold mt-2">Reintentar</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-neutral-900 flex items-center gap-3">
                        <Dumbbell className="text-purple-600" size={32} />
                        Reservación en Tiempo Real
                    </h1>
                    <p className="text-neutral-500 mt-2">Fila virtual inteligente.</p>
                </header>

                {/* TURNO ACTUAL */}
                {miTurno && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4">
                        <div className={`p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${
                            miTurno.estado === 'usando' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'
                        }`}>
                            <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-2xl ${miTurno.estado === 'usando' ? 'bg-green-500' : 'bg-purple-500'} text-white shadow-lg`}>
                                    {miTurno.estado === 'usando' ? <Play size={28} /> : <Timer size={28} />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                        {miTurno.estado === 'usando' ? 'En uso actualmente' : 'Tu posición'}
                                    </p>
                                    <h2 className="text-2xl font-black text-neutral-900">{miTurno.maquinaNombre}</h2>
                                    {miTurno.estado === 'esperando' && (
                                        <p className="text-purple-600 font-bold">Espera aprox: {miTurno.posicion * 10} min</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {miTurno.estado === 'esperando' ? (
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <span className="block text-4xl font-black text-purple-600">{miTurno.posicion}</span>
                                            <span className="text-[10px] font-bold text-purple-400 uppercase">Lugar</span>
                                        </div>
                                        <button onClick={abandonarFila} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={finalizarUso} className="w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                                        <CheckCircle2 size={20} /> LIBERAR
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* LISTA DE MÁQUINAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maquinas.map((maquina) => (
                        <div key={maquina.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-neutral-50 p-3 rounded-2xl group-hover:bg-purple-50 transition-colors">
                                    <Dumbbell className="text-neutral-400 group-hover:text-purple-500" size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    maquina.estaOcupada ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                }`}>
                                    {maquina.estaOcupada ? 'Ocupada' : 'Libre'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-neutral-900 mb-1">{maquina.nombre}</h3>
                            <p className="text-sm text-neutral-400 mb-6">{maquina.categoria}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-neutral-50 p-3 rounded-2xl">
                                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                                        <Users size={14} />
                                        <span className="text-[10px] font-bold uppercase">Fila</span>
                                    </div>
                                    <p className="font-bold text-neutral-800">{maquina.personasEnFila || 0}</p>
                                </div>
                                <div className="bg-neutral-50 p-3 rounded-2xl">
                                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                                        <Timer size={14} />
                                        <span className="text-[10px] font-bold uppercase">Espera</span>
                                    </div>
                                    <p className="font-bold text-neutral-800">{(maquina.personasEnFila || 0) * (maquina.tiempo_estimado_uso || 10)}m</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => unirseAFila(maquina)}
                                disabled={miTurno !== null}
                                className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                                    miTurno 
                                    ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed' 
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-50'
                                }`}
                            >
                                {maquina.estaOcupada ? 'UNIRSE A FILA' : 'USAR AHORA'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reservaciones;