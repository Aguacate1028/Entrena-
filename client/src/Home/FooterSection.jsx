import React from 'react';
import { Dumbbell } from 'lucide-react';

const FooterSection = () => {
    return (
        <footer className="bg-white border-t border-neutral-200 py-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-neutral-500 text-sm">
                
                {/* Logo entrena+ igual al Header */}
                <div className="flex items-center gap-2">
                    <div className="bg-purple-500 p-2 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-neutral-900">
                        entrena<span className="text-purple-500">+</span>
                    </span>
                </div>
                
                {/* Enlaces de Navegación */}
                <div className="flex gap-8 font-medium">
                   
                </div>

                {/* Copyright */}
                <p className="text-neutral-400">© 2025 Entrena+. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default FooterSection;