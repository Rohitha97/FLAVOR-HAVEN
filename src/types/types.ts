import { type } from "os";

export type MenuType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

export type CategoryType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
};

export type ProductType = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  isFeatured?: boolean;
  catSlug: string;
  options?: { title: string; additionalPrice: number }[];
};

export type OrderType = {
  id: string;
  userEmail: string;
  price: number;
  products: CartItemType[];
  status: string;
  createdAt: Date;
  intent_id?: String;
};

export type CartItemType = {
  id: string;
  title: string;
  img?: string;
  price: number;
  optionTitle?: string;
  quantity: number;
};

export type NortificationType = {
  id: string;
  title: string;
  toDate?: string;
};

export type CartType = {
  products: CartItemType[];
  totalItems: number;
  totalPrice: number;
};

export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (item: CartItemType) => void;
};
