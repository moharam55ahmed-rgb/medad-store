export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  tone?: "new" | "sale";
  category?: string;
  brand?: string;
  brandSlug?: string;
  volume?: string;
  kind?: string;
  skinType?: string;
  desc?: string;
};

export type CartItem = Product & { qty: number };

export type IconName =
  | "skin"
  | "makeup"
  | "perfume"
  | "hair"
  | "body"
  | "gift"
  | "brush"
  | "reward"
  | "crown"
  | "cake"
  | "points"
  | "user"
  | "truck"
  | "shield"
  | "refresh"
  | "apple"
  | "play"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "snap"
  | "search"
  | "bag"
  | "menu"
  | "close"
  | "card"
  | "home"
  | "grid"
  | "bell"
  | "pin"
  | "box";

export type OrderStatus = "received" | "preparing" | "shipped" | "delivered";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  volume?: string;
};

export type Order = {
  id: string;
  date: string;
  time: string;
  status: OrderStatus;
  statusLabel: string;
  payment: string;
  name: string;
  phone: string;
  address: string;
  discount: number;
  shipping: number;
  items: OrderItem[];
};

export type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  face: string;
  products: string;
  bg: string;
};
