export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      models: {
        Row: {
          id: string;
          created_at: string;
          model_name: string;
          config: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          model_name: string;
          config: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          model_name?: string;
          config?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

