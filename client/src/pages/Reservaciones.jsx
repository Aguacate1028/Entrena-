import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabase'; // Asegúrate de que esta sea la ruta a tu cliente supabase
import { 
    Dumbbell, Timer, Users, Play, 
    CheckCircle2, XCircle, ArrowRight, Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Reservaciones = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    
    const [maquinas, setMaquinas] = useState([]);
    const [miTurno, setMiTurno] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const userId = user?.id_usuario || user?.id;

    // Cargar datos iniciales y configurar suscripción Realtime
    useEffect(() => {
        if (!userId) return;

        fetchData();

        // Suscripción a cambios en la fila de máquinas en tiempo real
        const channel = supabase
            .channel('realtime-gym-queue')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'fila_maquinas' }, 
                () => fetchData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const fetchData = async () => {
        try {
            // 1. Obtener máquinas con sus filas actuales
            const { data: mData, error: mError } = await supabase
                .from('maquinas')
                .select('*, fila_maquinas(id, estado, id_usuario)');
            
            if (mError) throw mError;

            const maquinasProcesadas = mData.map(m => ({
                ...m,
                personasEnFila: m.fila_maquinas.filter(f => f.estado === 'esperando').length,
                estaOcupada: m.fila_maquinas.some(f => f.estado === 'usando'),
                usuarioActual: m.fila_maquinas.find(f => f.estado === 'usando')?.id_usuario
            }));
            setMaquinas(maquinasProcesadas);

            // 2. Obtener mi turno activo
            const { data: tData, error: tError } = await supabase
                .from('fila_maquinas')
                .select('*, maquinas(nombre)')
                .eq('id_usuario', userId)
                .neq('estado', 'finalizado')
                .maybeSingle();

            if (tData) {
                // Calcular posición contando cuántos registros 'esperando' tienen un ID menor al mío para esa máquina
                const { count } = await supabase
                    .from('fila_maquinas')
                    .select('*', { count: 'exact', head: true })
                    .eq('id_maquina', tData.id_maquina)
                    .eq('estado', 'esperando')
                    .lt('id', tData.id);

                const miPosicion = (count || 0) + 1;

                // Notificaciones de proximidad
                if (miTurno && miTurno.posicion !== miPosicion) {
                    if (miPosicion === 2) addToast("¡Faltan 5 minutos para tu turno!", "info");
                    if (miPosicion === 1) addToast("Solo queda una persona por delante", "info");
                }
                
                // Si el estado cambió de esperando a usando
                if (miTurno?.estado === 'esperando' && tData.estado === 'usando') {
                    addToast("¡Es tu turno! La máquina está lista.", "success");
                }

                setMiTurno({ 
                    ...tData, 
                    posicion: tData.estado === 'usando' ? 0 : miPosicion,
                    maquinaNombre: tData.maquinas.nombre 
                });
            } else {
                setMiTurno(null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const unirseAFila = async (maquina) => {
        if (miTurno) {
            addToast("Ya tienes una reservación activa", "error");
            return;
        }

        const { error } = await supabase
            .from('fila_maquinas')
            .insert([{ 
                id_maquina: maquina.id, 
                id_usuario: userId, 
                estado: maquina.estaOcupada ? 'esperando' : 'usando',
                posicion: 0 // La posición real se calcula en el fetch
            }]);

        if (error) {
            addToast("Error al unirse a la fila", "error");
        } else {
            addToast(maquina.estaOcupada ? "Te has unido a la fila" : "Puedes usar la máquina ahora", "success");
        }
    };

    const finalizarUso = async () => {
        try {
            // 1. Finalizar mi turno
            const { error: err1 } = await supabase
                .from('fila_maquinas')
                .update({ estado: 'finalizado' })
                .eq('id', miTurno.id);
            if (err1) throw err1;

            // 2. Buscar al siguiente en la fila
            const { data: siguiente } = await supabase
                .from('fila_maquinas')
                .select('id')
                .eq('id_maquina', miTurno.id_maquina)
                .eq('estado', 'esperando')
                .order('id', { ascending: true })
                .limit(1)
                .maybeSingle();

            // 3. Si hay alguien, pasarle el turno
            if (siguiente) {
                await supabase
                    .from('fila_maquinas')
                    .update({ estado: 'usando' })
                    .eq('id', siguiente.id);
            }

            addToast("Entrenamiento finalizado correctamente", "success");
            setMiTurno(null);
            fetchData();
        } catch (error) {
            addToast("Error al liberar la máquina", "error");
        }
    };

    const abandonarFila = async () => {
        const { error } = await supabase
            .from('fila_maquinas')
            .delete()
            .eq('id', miTurno.id);
        
        if (!error) {
            addToast("Has abandonado la fila", "info");
            setMiTurno(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-neutral-500">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-bold">Sincronizando máquinas...</p>
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
                    <p className="text-neutral-500 mt-2">Fila virtual inteligente para optimizar tu entrenamiento.</p>
                </header>

                {/* TURNO ACTUAL */}
                {miTurno && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className={`p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${
                            miTurno.estado === 'usando' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'
                        }`}>
                            <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-2xl ${miTurno.estado === 'usando' ? 'bg-green-500' : 'bg-purple-500'} text-white shadow-lg`}>
                                    {miTurno.estado === 'usando' ? <Play size={28} /> : <Timer size={28} />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                        {miTurno.estado === 'usando' ? 'En uso actualmente' : 'Tu posición en la fila'}
                                    </p>
                                    <h2 className="text-2xl font-black text-neutral-900">{miTurno.maquinaNombre}</h2>
                                    {miTurno.estado === 'esperando' && (
                                        <p className="text-purple-600 font-bold">Espera est: {miTurno.posicion * 10} min</p>
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
                                        <CheckCircle2 size={20} /> FINALIZAR USO
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* GRID DE MÁQUINAS */}
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
                                        <span className="text-[10px] font-bold uppercase">En Fila</span>
                                    </div>
                                    <p className="font-bold text-neutral-800">{maquina.personasEnFila}</p>
                                </div>
                                <div className="bg-neutral-50 p-3 rounded-2xl">
                                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                                        <Timer size={14} />
                                        <span className="text-[10px] font-bold uppercase">Espera</span>
                                    </div>
                                    <p className="font-bold text-neutral-800">{maquina.personasEnFila * (maquina.tiempo_estimado_uso || 10)} min</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => unirseAFila(maquina)}
                                disabled={miTurno}
                                className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                                    miTurno 
                                    ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed' 
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-50'
                                }`}
                            >
                                {maquina.estaOcupada ? 'UNIRSE A LA FILA' : 'USAR AHORA'}
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