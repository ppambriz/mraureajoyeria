import { X, Plus, Minus, Trash2, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

interface CartDrawerProps {
  whatsappNumber: string;
}

export default function CartDrawer({ whatsappNumber }: CartDrawerProps) {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart();

  const buildWhatsAppMessage = () => {
    let msg = '¡Hola! Quiero hacer el siguiente pedido:%0A%0A';
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.product.name}%0A`;
      msg += `   Cantidad: ${item.quantity}%0A`;
      msg += `   Precio: ${formatPrice(item.product.price)}%0A`;
      msg += `   Subtotal: ${formatPrice(item.product.price * item.quantity)}%0A%0A`;
    });
    msg += `%0A*Total: ${formatPrice(totalPrice)}*%0A%0A`;
    msg += '¿Podrían confirmarme la disponibilidad y los métodos de pago? ¡Gracias!';
    return msg;
  };

  const sendWhatsAppOrder = () => {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${msg}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-rose-950/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100 bg-rose-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-serif text-rose-950">Tu Pedido ({totalItems})</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-rose-200 mb-4" />
              <p className="text-rose-400 text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-rose-300 text-sm">Agrega productos para enviar tu pedido</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-rose-50/50 rounded-xl p-3 border border-rose-100"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-rose-950 text-sm truncate">{item.product.name}</h4>
                    <p className="text-rose-600 font-semibold text-sm mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 bg-white border border-rose-200 rounded-md text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium text-rose-950 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 bg-white border border-rose-200 rounded-md text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1 text-rose-400 hover:text-rose-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={clearCart}
                className="text-sm text-rose-400 hover:text-rose-600 transition-all"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-rose-100 p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-rose-400">Total</span>
              <span className="text-2xl font-serif font-semibold text-rose-950">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              onClick={sendWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              <Send className="w-5 h-5" />
              Enviar pedido por WhatsApp
            </button>
            <p className="text-center text-xs text-rose-300 mt-3">
              Se abrirá WhatsApp con tu pedido listo para enviar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
