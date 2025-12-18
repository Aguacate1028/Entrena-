import React, { useState, useContext } from 'react';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Trophy, Flame, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SimpleImage = ({ src, alt, className }) => (
  <img 
    src={src} 
    alt={alt} 
    className={className} 
    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible'; }} 
  />
);

const Comunidad = () => {
  // Obtenemos datos reales del contexto
  const { user, isAuthenticated } = useContext(AuthContext);
  const userName = user?.nombre || "Usuario";

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'María López',
      avatar: '👩',
      time: 'Hace 2 horas',
      content: '¡Nuevo récord personal en peso muerto! 💪 120kg x 5 reps. El trabajo duro da resultados.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      likes: 42,
      comments: 8,
      achievement: {
        icon: Trophy,
        text: 'Nuevo récord personal',
        color: 'text-purple-500'
      }
    },
    {
      id: 2,
      author: 'Carlos Ruiz',
      avatar: '👨',
      time: 'Hace 5 horas',
      content: 'Primera clase de CrossFit completada. ¡Qué intensidad! Gracias al entrenador por la motivación 🔥',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      likes: 35,
      comments: 12,
      achievement: {
        icon: Flame,
        text: 'Racha de 7 días',
        color: 'text-purple-500'
      }
    },
    {
      id: 3,
      author: 'Ana Martínez',
      avatar: '👩‍🦰',
      time: 'Hace 1 día',
      content: 'Sesión de yoga matutina completada ✨ Nada mejor para comenzar el día con energía positiva',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      likes: 28,
      comments: 5
    },
    {
        id: 4,
        author: 'Pedro Sánchez',
        avatar: '👨‍🦱',
        time: 'Hace 2 días',
        content: '¡50 clases completadas en entrena+! Este lugar realmente cambió mi vida y mi salud. ¡Vamos por las próximas 50!',
        likes: 67,
        comments: 15,
        achievement: {
          icon: Trophy,
          text: '50 clases completadas',
          color: 'text-purple-500'
        }
      }
  ]);

  const [newPost, setNewPost] = useState('');

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: userName,
        avatar: '😊', // Podrías usar la inicial del usuario aquí
        time: 'Ahora',
        content: newPost,
        likes: 0,
        comments: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-neutral-900 font-bold text-xl mb-2">Únete a la Comunidad</h2>
          <p className="text-neutral-600 mb-4">
            Inicia sesión para ver y compartir tu progreso con otros miembros
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Create Post */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-neutral-100">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">😊</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={`¿Qué tal tu entrenamiento, ${userName}?`}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-neutral-700"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-purple-500 transition-colors text-sm font-medium">
                  <ImageIcon className="w-5 h-5" />
                  Foto
                </button>
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg shadow-purple-200"
                >
                  <Send className="w-4 h-4" />
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => {
            const AchievementIcon = post.achievement?.icon;
            return (
              <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-2xl">{post.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900">{post.author}</div>
                    <div className="text-xs text-neutral-500 font-medium">{post.time}</div>
                  </div>
                </div>

                {/* Achievement Badge */}
                {post.achievement && AchievementIcon && (
                  <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl inline-flex">
                    <AchievementIcon className={`w-5 h-5 ${post.achievement.color}`} />
                    <span className="text-purple-700 font-bold text-sm">{post.achievement.text}</span>
                  </div>
                )}

                {/* Post Content */}
                <p className="text-neutral-700 mb-4 leading-relaxed">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <SimpleImage
                      src={post.image}
                      alt="Post"
                      className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-neutral-500 hover:text-purple-500 transition-colors group"
                  >
                    <Heart className="w-5 h-5 group-hover:fill-purple-500 group-hover:text-purple-500 transition-colors" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-500 hover:text-purple-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-500 hover:text-purple-500 transition-colors ml-auto text-sm font-medium">
                    <Share2 className="w-5 h-5" />
                    Compartir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Comunidad;