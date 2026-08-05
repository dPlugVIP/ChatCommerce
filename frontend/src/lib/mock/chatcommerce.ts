import type { BusinessSettings, Conversation, Product } from "@/types";

export const businessSettings: BusinessSettings = {
  name: "DplugVIP",
  supportEmail: "hello@dplugvip.com",
  replyTime: "Typically replies in 5 minutes",
  primaryColor: "#004ac6",
};

export const categories = ["All Categories", "Electronics", "Fashion", "Home", "Industrial"];

export const products: Product[] = [
  {
    id: "prod-macbook-pro-14",
    slug: "macbook-pro-14",
    title: 'MacBook Pro 14" M3 Max',
    description: "Sealed unit, Space Black, 36GB RAM, 1TB SSD. Built for serious creative and business work.",
    category: "Electronics",
    price: 3200,
    stock: 3,
    status: "published",
    tag: "New",
    images: [
      {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        alt: "Space gray laptop on a clean desk",
      },
      {
        src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
        alt: "Laptop workspace beside notebook",
      },
      {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
        alt: "Laptop on white table",
      },
    ],
    features: ["M3 Max chip", "36GB unified memory", "1TB SSD storage", "Space Black finish"],
    specs: [
      { label: "Processor", value: "Apple M3 Max" },
      { label: "Memory", value: "36GB" },
      { label: "Storage", value: "1TB SSD" },
      { label: "Condition", value: "Brand new" },
    ],
  },
  {
    id: "prod-speaker",
    slug: "aura-smart-speaker-pro",
    title: "Aura Smart Speaker Pro",
    description: "Premium acoustics for modern spaces.",
    category: "Electronics",
    price: 1200,
    stock: 12,
    status: "published",
    tag: "New",
    images: [
      {
        src: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
        alt: "Modern black smart speaker",
      },
    ],
  },
  {
    id: "prod-chair",
    slug: "ergotask-executive-chair",
    title: "ErgoTask Executive Chair",
    description: "All-day comfort with breathable mesh.",
    category: "Home",
    price: 850,
    stock: 18,
    status: "published",
    images: [
      {
        src: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
        alt: "Black ergonomic office chair",
      },
    ],
  },
  {
    id: "prod-cotton",
    slug: "organic-cotton-basics",
    title: "Organic Cotton Basics (Lot of 100)",
    description: "Wholesale premium apparel blanks.",
    category: "Fashion",
    price: 1500,
    stock: 100,
    status: "published",
    images: [
      {
        src: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80",
        alt: "Folded neutral cotton shirts",
      },
    ],
  },
  {
    id: "prod-espresso",
    slug: "commercial-espresso-kit",
    title: "Commercial Espresso Kit",
    description: "Professional grade extraction tools.",
    category: "Industrial",
    price: 450,
    stock: 9,
    status: "published",
    tag: "Restocked",
    images: [
      {
        src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=80",
        alt: "Espresso machine tools on a counter",
      },
    ],
  },
  {
    id: "prod-headphones",
    slug: "aura-pro-noise-cancelling-headphones",
    title: "Aura Pro Noise Cancelling Headphones",
    description: "High-fidelity audio with active noise cancellation and 30-hour battery life.",
    category: "Audio",
    price: 349,
    stock: 0,
    status: "draft",
    images: [
      {
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        alt: "Silver headphones on a light background",
      },
    ],
  },
  {
    id: "prod-watch",
    slug: "apex-series-smartwatch",
    title: "Apex Series Smartwatch - Obsidian Black",
    description: "Wearable productivity with health tracking.",
    category: "Electronics",
    price: 299,
    stock: 45,
    status: "published",
    images: [
      {
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        alt: "Black smartwatch product photo",
      },
    ],
  },
];

export const conversations: Conversation[] = [
  {
    id: "conv-sarah",
    customerName: "Sarah Jenkins",
    customerInitials: "SJ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    status: "open",
    unreadCount: 2,
    lastMessage: "Is this coffee table available in oak?",
    lastMessageAt: "Just now",
    productId: "prod-macbook-pro-14",
    messages: [
      {
        id: "msg-1",
        sender: "customer",
        body: 'Hi, I am looking at the MacBook Pro 14" you have listed. Is this the exact model pictured?',
        timestamp: "10:42 AM",
        productId: "prod-macbook-pro-14",
      },
      {
        id: "msg-2",
        sender: "business",
        body: "Hello! Yes, that is the exact model. Brand new, sealed in box. We have 3 left in Space Black.",
        timestamp: "10:45 AM",
      },
      {
        id: "msg-3",
        sender: "customer",
        body: "Great. Can I arrange to pick it up later today?",
        timestamp: "10:47 AM",
      },
      {
        id: "msg-4",
        sender: "business",
        body: "Absolutely. We are open until 7 PM. Would you like me to hold one for you?",
        timestamp: "10:48 AM",
      },
    ],
  },
  {
    id: "conv-marcus",
    customerName: "Marcus Chen",
    customerInitials: "MC",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    status: "open",
    unreadCount: 0,
    lastMessage: "Thanks for the quick shipping!",
    lastMessageAt: "2h ago",
    productId: "prod-chair",
    messages: [],
  },
  {
    id: "conv-elena",
    customerName: "Elena Lopez",
    customerInitials: "EL",
    status: "closed",
    unreadCount: 0,
    lastMessage: "I need to return order #4920.",
    lastMessageAt: "Yesterday",
    productId: "prod-espresso",
    messages: [],
  },
];

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
