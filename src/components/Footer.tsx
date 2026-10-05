import { Gem, Instagram, Facebook, Mail, Phone } from 'lucide-react';

interface FooterProps {
  storeName: string;
  whatsappNumber: string;
}

export default function Footer({ storeName, whatsappNumber }: FooterProps) {
  return (
    <footer className="bg-rose-950 text-rose-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gem className="w-6 h-6 text-rose-400" />
              <span className="text-xl font-serif">{storeName}</span>
            </div>
            <p className="text-rose-300 text-sm leading-relaxed">
              Joyería artesanal de lujo. Collares, aretes, pulseras, anillos y charms
              diseñados para realzar tu belleza natural.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-rose-200 mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-rose-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400" />
                <span>+{whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>contacto@mraurea.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-rose-200 mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-rose-800 hover:bg-rose-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-rose-800 hover:bg-rose-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-rose-800 mt-10 pt-6 text-center text-sm text-rose-400">
          <p>&copy; {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
