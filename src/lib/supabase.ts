import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'admin' | 'rep';
          display_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'admin' | 'rep';
          display_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'admin' | 'rep';
          display_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          vintage: string;
          price_per_case: number;
          description: string | null;
          category: string;
          in_stock: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vintage: string;
          price_per_case: number;
          description?: string | null;
          category: string;
          in_stock?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vintage?: string;
          price_per_case?: number;
          description?: string | null;
          category?: string;
          in_stock?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          rep_id: string;
          client_id: string;
          subtotal: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rep_id: string;
          client_id: string;
          subtotal?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rep_id?: string;
          client_id?: string;
          subtotal?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_per_case: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity?: number;
          price_per_case: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price_per_case?: number;
          created_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          store_type: string;
          location: string;
          contact_person: string;
          phone: string | null;
          email: string;
          rep_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          store_type: string;
          location: string;
          contact_person: string;
          phone?: string | null;
          email: string;
          rep_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          store_type?: string;
          location?: string;
          contact_person?: string;
          phone?: string | null;
          email?: string;
          rep_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
}