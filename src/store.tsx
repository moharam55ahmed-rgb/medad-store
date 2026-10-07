import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sampleOrders } from "./data";
import type { CartItem, Order, Product } from "./types";

export type Profile = { name: string; email: string; phone: string };

type Store = {
  cart: CartItem[];
  wished: string[];
  cartOpen: boolean;
  toast: string | null;
  points: number;
  loggedIn: boolean;
  profile: Profile;
  orders: Order[];
  count: number;
  addToCart: (product: Product, qty?: number) => void;
  toggleWish: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  notify: (message: string) => void;
  login: (profile?: Partial<Profile>, silent?: boolean) => void;
  logout: () => void;
  redeem: (cost: number) => boolean;
  placeOrder: (payment: string) => Order | null;
};

const StoreContext = createContext<Store | null>(null);

const defaultProfile: Profile = {
  name: "سارة أحمد",
  email: "sara.ahmed@email.com",
  phone: "+973 3999 1234",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wished, setWished] = useState<string[]>(["perfume", "set", "lipstick", "cream"]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [points, setPoints] = useState(1250);
  const [loggedIn, setLoggedIn] = useState(true);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const api = useMemo<Store>(() => {
    function notify(message: string) {
      setToast(message);
    }

    function addToCart(product: Product, qty = 1) {
      setCart((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (!existing) return [...current, { ...product, qty }];
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + qty } : item));
      });
      notify("تمت الإضافة إلى السلة");
    }

    function placeOrder(payment: string): Order | null {
      if (cart.length === 0) return null;
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const discount = subtotal >= 20 ? 2 : 0;
      const shipping = subtotal >= 30 ? 0 : 1.5;
      const total = Math.max(subtotal - discount + shipping, 0);
      const created: Order = {
        id: `MD${Math.floor(24000 + Math.random() * 700)}`,
        date: "6 أكتوبر 2026",
        time: "03:40 م",
        status: "preparing",
        statusLabel: "قيد التجهيز",
        payment,
        name: profile.name,
        phone: profile.phone,
        address: "المنامة، الدبلوماسية، البحرين",
        discount,
        shipping,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
          volume: item.volume,
        })),
      };
      setOrders((prev) => [created, ...prev]);
      setPoints((value) => value + Math.max(1, Math.round(total)));
      setCart([]);
      notify("تم استلام طلبك بنجاح");
      return created;
    }

    return {
      cart,
      wished,
      cartOpen,
      toast,
      points,
      loggedIn,
      profile,
      orders,
      count,
      addToCart,
      toggleWish: (id) => {
        setWished((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
      },
      setQty: (id, qty) => {
        setCart((current) =>
          qty <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => (item.id === id ? { ...item, qty } : item)),
        );
      },
      clearCart: () => setCart([]),
      setCartOpen,
      notify,
      login: (next, silent) => {
        setProfile((current) => ({ ...current, ...next }));
        setLoggedIn(true);
        if (!silent) notify("أهلًا بكِ في مداد");
      },
      logout: () => {
        setLoggedIn(false);
        notify("تم تسجيل الخروج");
      },
      redeem: (cost) => {
        if (points < cost) {
          notify("نقاطك لا تكفي لهذا الاستبدال");
          return false;
        }
        setPoints((value) => value - cost);
        notify("تم استبدال النقاط");
        return true;
      },
      placeOrder,
    };
  }, [cart, wished, cartOpen, toast, points, loggedIn, profile, orders, count]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore يجب أن يُستخدم داخل المتجر");
  return value;
}
