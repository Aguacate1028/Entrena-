import React, { useState, useEffect, useContext } from 'react';
import { Heart, MessageCircle, Send, Image as ImageIcon, MoreHorizontal, User, Loader, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { obtenerPostsRequest, crearPostRequest, darLikeRequest, comentarRequest, eliminarPostRequest } from '../api/comunidad';

const Comunidad = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para crear nuevo post
    const [newText, setNewText] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [posting, setPosting] = useState(false);

    // Estado para el Modal de Confirmación
    const [confirmData, setConfirmData] = useState({ isOpen: false, idPost: null }); // <--- 2. ESTADO DEL MODAL
    const [deleting, setDeleting] = useState(false);

    // Cargar Feed
    const cargarFeed = async () => {
        try {
            const data = await obtenerPostsRequest();
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarFeed();
    }, []);

    // Manejar subida de post
    const handlePublicar = async (e) => {
        e.preventDefault();
        if (!newText.trim() && !newImage) return;

        setPosting(true);
        try {
            const formData = new FormData();
            formData.append('id_usuario', user.id_usuario || user.id);
            formData.append('texto', newText);
            if (newImage) formData.append('imagen', newImage);

            await crearPostRequest(formData);
            
            addToast('Publicado con éxito', 'success');
            setNewText("");
            setNewImage(null);
            cargarFeed(); 
        } catch (error) {
            addToast('Error al publicar', 'error');
        } finally {
            setPosting(false);
        }
    };

    // Manejar Like
    const handleLike = async (idPost) => {
        try {
            await darLikeRequest(idPost);
            setPosts(posts.map(p => 
                p.id === idPost ? { ...p, likes: (p.likes || 0) + 1 } : p
            ));
        } catch (error) {
            console.error(error);
        }
    };

    // --- LÓGICA DE ELIMINACIÓN ---

    // 1. Abrir el modal al hacer clic en borrar
    const handleDeleteClick = (idPost) => {
        setConfirmData({ isOpen: true, idPost });
    };

    // 2. Ejecutar borrado al confirmar en el modal
    const procederEliminacion = async () => {
        if (!confirmData.idPost) return;

        setDeleting(true);
        try {
            const idUsuario = user.id_usuario || user.id;
            await eliminarPostRequest(confirmData.idPost, idUsuario);
            
            // Actualizar UI
            setPosts(posts.filter(p => p.id !== confirmData.idPost));
            addToast("Publicación eliminada", "success");
            
            // Cerrar modal
            setConfirmData({ isOpen: false, idPost: null });
        } catch (error) {
            addToast("Error al eliminar", "error");
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Comunidad <span className="text-purple-600">Entrena+</span></h1>
                    <p className="text-neutral-500 mt-2">Comparte tus logros y motiva a los demás.</p>
                </div>

                {/* --- CAJA DE CREAR POST --- */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 mb-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {user?.foto_perfil ? <img src={user.foto_perfil} className="w-full h-full object-cover"/> : <User className="text-purple-600"/>}
                        </div>
                        <div className="flex-grow">
                            <textarea
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                placeholder={`¿Qué lograste hoy, ${user?.nombre || 'atleta'}?`}
                                className="w-full bg-gray-50 rounded-xl p-4 border-none focus:ring-2 focus:ring-purple-100 resize-none h-24 transition-all"
                            />
                            
                            {newImage && (
                                <div className="mt-2 relative inline-block">
                                    <img src={URL.createObjectURL(newImage)} alt="Preview" className="h-20 rounded-lg object-cover border border-gray-200"/>
                                    <button onClick={() => setNewImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><XIcon size={12}/></button>
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-4">
                                <label className="cursor-pointer flex items-center gap-2 text-neutral-500 hover:text-purple-600 transition-colors text-sm font-bold bg-gray-50 px-4 py-2 rounded-lg hover:bg-purple-50">
                                    <ImageIcon size={18}/> Foto
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewImage(e.target.files[0])} />
                                </label>

                                <button 
                                    onClick={handlePublicar}
                                    disabled={posting || (!newText && !newImage)}
                                    className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-900 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {posting ? <Loader size={16} className="animate-spin"/> : <><Send size={16}/> Publicar</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FEED DE POSTS --- */}
                {loading ? (
                    <div className="text-center py-10"><Loader className="animate-spin mx-auto text-purple-600"/></div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                user={user} 
                                onLike={handleLike} 
                                onDeleteClick={handleDeleteClick} // <--- Pasamos la función de abrir modal
                            />
                        ))}
                        {posts.length === 0 && (
                            <p className="text-center text-gray-400 py-10">Aún no hay publicaciones. ¡Sé el primero!</p>
                        )}
                    </div>
                )}
            </div>

            {/* --- MODAL DE CONFIRMACIÓN (ELIMINAR) --- */}
            <ConfirmModal 
                isOpen={confirmData.isOpen}
                onClose={() => setConfirmData({ ...confirmData, isOpen: false })}
                onConfirm={procederEliminacion}
                title="¿Eliminar publicación?"
                message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres borrar este post?"
                isLoading={deleting}
            />
        </div>
    );
};

// Sub-componente para cada Tarjeta de Post
const PostCard = ({ post, user, onLike, onDeleteClick }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comentarios, setComentarios] = useState(post.comentarios || []);

    // Verificar si el post es mío
    const isOwner = user && (user.id_usuario || user.id) === post.id_usuario;

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const nuevoComentario = {
                id: Date.now(),
                texto: commentText,
                usuarios: { nombre: user.nombre, foto_perfil: user.foto_perfil }
            };
            setComentarios([...comentarios, nuevoComentario]);
            setCommentText("");
            await comentarRequest(post.id, user.id_usuario || user.id, commentText);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow relative">
            {/* Cabecera Post */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                        {post.usuarios?.foto_perfil ? <img src={post.usuarios.foto_perfil} className="w-full h-full object-cover"/> : <User className="p-2 text-gray-400"/>}
                    </div>
                    <div>
                        <h4 className="font-bold text-neutral-900 text-sm">{post.usuarios?.nombre || "Usuario"}</h4>
                        <p className="text-xs text-neutral-400">{new Date(post.fecha).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* --- BOTÓN ELIMINAR (Solo si es dueño) --- */}
                {isOwner ? (
                    <button 
                        onClick={() => onDeleteClick(post.id)} // Llama a la función del padre
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="Eliminar publicación"
                    >
                        <Trash2 size={20}/>
                    </button>
                ) : (
                    <button className="text-gray-300 hover:text-gray-600"><MoreHorizontal size={20}/></button>
                )}
            </div>

            {/* Contenido */}
            <p className="text-neutral-700 mb-4 leading-relaxed whitespace-pre-line">{post.texto}</p>
            {post.imagen && (
                <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100">
                    <img src={post.imagen} alt="Post content" className="w-full object-cover max-h-96"/>
                </div>
            )}

            {/* Acciones */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                <button 
                    onClick={() => onLike(post.id)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors group"
                >
                    <Heart size={20} className="group-hover:fill-red-500 transition-colors"/> {post.likes || 0}
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors"
                >
                    <MessageCircle size={20}/> {comentarios.length}
                </button>
            </div>

            {/* Sección de Comentarios */}
            {showComments && (
                <div className="mt-4 pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-[32px]">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                        {comentarios.map((c, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                     {c.usuarios?.foto_perfil ? <img src={c.usuarios.foto_perfil} className="w-full h-full object-cover"/> : <User size={16} className="m-1.5 text-gray-400"/>}
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 text-sm shadow-sm">
                                    <span className="font-bold text-neutral-900 block text-xs mb-1">{c.usuarios?.nombre}</span>
                                    {c.texto}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Escribe un comentario..." 
                            className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-300"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                        />
                        <button onClick={handleComment} className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700">
                            <Send size={16}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const XIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default Comunidad;