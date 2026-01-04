import { X, CheckCircle, AlertCircle, PlayCircle, Activity } from 'lucide-react';

const GuiaModal = ({ maquina, onClose }) => {
    // Si no hay máquina seleccionada, no renderizamos nada
    if (!maquina) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Contenedor del Modal */}
            <div className="bg-white w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-scale-up border border-neutral-100">
                
                {/* --- HEADER --- */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10">
                    <div className="flex gap-5">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                            <DumbbellIcon size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-neutral-900 leading-tight">{maquina.nombre}</h2>
                            <p className="text-neutral-500 text-sm mt-1">{maquina.descripcion}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* --- BODY (Scrollable) --- */}
                <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                    
                    {/* Tags Músculos */}
                    <div>
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Músculos Trabajados</h3>
                        <div className="flex flex-wrap gap-2">
                            {maquina.musculos?.map((m, i) => (
                                <span key={i} className="bg-purple-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg shadow-purple-200">
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Instrucciones */}
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <PlayCircle size={20} className="text-purple-600"/> Instrucciones Paso a Paso
                        </h3>
                        <div className="space-y-4">
                            {maquina.instrucciones?.map((step, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-sm border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <p className="text-neutral-600 text-sm leading-relaxed pt-1.5 font-medium">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Consejos (Azul) */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6">
                            <h4 className="text-blue-800 font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                                <CheckCircle size={16} /> Consejos Útiles
                            </h4>
                            <ul className="space-y-3">
                                {maquina.consejos?.map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-blue-700/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Advertencias (Rojo) */}
                        {maquina.advertencias && maquina.advertencias.length > 0 && (
                            <div className="bg-red-50/50 border border-red-100 rounded-3xl p-6">
                                <h4 className="text-red-800 font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                                    <AlertCircle size={16} /> Evita errores
                                </h4>
                                <ul className="space-y-3">
                                    {maquina.advertencias.map((warn, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-red-700/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                            {warn}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- FOOTER (Stats) --- */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-16">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Series</p>
                        <p className="text-3xl font-black text-neutral-800 flex items-center gap-1 justify-center">
                            {maquina.series} <Activity size={16} className="text-purple-400"/>
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Repeticiones</p>
                        <p className="text-3xl font-black text-neutral-800">{maquina.reps}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Icono auxiliar
const DumbbellIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" /><path d="M6 4v2a6 6 0 0 0 12 0V4" /></svg>
);

export default GuiaModal;