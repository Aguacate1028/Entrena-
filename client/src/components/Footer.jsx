import { Link } from 'react-router-dom';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 font-sans">
            {/* --- SECCIÓN SUPERIOR --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* COLUMNA 1: MARCA Y DESCRIPCIÓN */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-black text-white tracking-tighter">
                                ENTRENA<span className="text-purple-500">+</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Más que un gimnasio, somos una comunidad comprometida con tu mejor versión. Equipamiento premium y entrenadores expertos.
                        </p>
                    </div>

                    {/* COLUMNA 2: ENLACES RÁPIDOS */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Explorar</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/" text="Inicio" />
                            <FooterLink to="/clases" text="Nuestras Clases" />
                            <FooterLink to="/membresias" text="Planes y Precios" />
                            <FooterLink to="/informacion" text="Sobre Nosotros" />
                        </ul>
                    </div>

                    {/* COLUMNA 3: CONTACTO */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-purple-500 flex-shrink-0 mt-1" />
                                <span className="text-sm">Av. Reforma 123, Ciudad de México, CDMX</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-purple-500 flex-shrink-0" />
                                <span className="text-sm">+52 55 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-purple-500 flex-shrink-0" />
                                <span className="text-sm">hola@entrenaplus.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA 4: HORARIOS */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Horarios</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                                <span>Lunes - Viernes</span>
                                <span className="text-white font-medium">5:00 AM - 11:00 PM</span>
                            </li>
                            <li className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                                <span>Sábados</span>
                                <span className="text-white font-medium">7:00 AM - 8:00 PM</span>
                            </li>
                            <li className="flex justify-between text-sm pb-2">
                                <span>Domingos</span>
                                <span className="text-white font-medium">8:00 AM - 4:00 PM</span>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <div className="flex items-center gap-2 text-purple-400 mb-1">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Abierto Ahora</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- BARRA INFERIOR --- */}
            <div className="bg-neutral-950 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© {currentYear} Entrena+. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

// Componentes auxiliares para limpiar el código
const FooterLink = ({ to, text }) => (
    <li>
        <Link 
            to={to} 
            className="text-sm hover:text-purple-500 hover:translate-x-1 transition-all duration-300 inline-block"
        >
            {text}
        </Link>
    </li>
);



export default Footer;