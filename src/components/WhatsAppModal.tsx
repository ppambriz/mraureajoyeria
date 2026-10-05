import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface WhatsAppModalProps {
  whatsappNumber: string;
}

export default function WhatsAppModal({ whatsappNumber }: WhatsAppModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const sendInfoRequest = () => {
    let msg = '¡Hola! ';
    if (name.trim()) msg += `Mi nombre es ${name}. `;
    msg += message.trim() || 'Me gustaría recibir más información sobre sus productos.';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setName('');
    setMessage('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-105 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-medium">Información</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/50 backdrop-blur-sm animate-fadeIn" onClick={() => setIsOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-rose-950">¿Tienes preguntas?</h3>
                  <p className="text-sm text-rose-400">Escríbenos por WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rose-950 mb-1.5">Tu nombre (opcional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-950 mb-1.5">Mensaje</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="¿Qué información necesitas?"
                  rows={4}
                  className="w-full px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <button
                onClick={sendInfoRequest}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
              >
                <Send className="w-5 h-5" />
                Enviar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
