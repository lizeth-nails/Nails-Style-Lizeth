export type Gender = 'female' | 'male';

export interface Client {
  id: string;
  name: string;
  gender: Gender;
  phone: string; // WhatsApp mobile e.g. "+57 315 789 4432"
  notes: string; // Clinical notes, allergies, styling preferences
  has_allergies?: boolean;
  last_service_date?: string; // e.g. "2026-09-19"
  last_service_name?: string; // e.g. "Manicure Semipermanente"
  avatar_url?: string;
  created_at?: string;
}

export interface ServiceItem {
  id: 'semi' | 'trad' | 'care';
  name: string;
  duration_minutes: number;
  duration_text: string;
  price_cop: number;
  price_formatted: string;
  cycle_days: number;
  description: string;
  icon: string;
  color_badge: string;
}

export interface Appointment {
  id: string; // e.g. "#145"
  numeric_id: number;
  client_id?: string;
  client_name: string;
  client_gender: Gender;
  client_phone: string;
  service_id: 'semi' | 'trad' | 'care';
  service_name: string;
  service_price: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  hour_badge: string; // "10", "11", "02", "04"
  duration_text: string; // "1h 30m"
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface SmartReminder {
  id: string;
  client_id: string;
  client_name: string;
  client_gender: Gender;
  client_phone: string;
  service_name: string;
  cycle_days: 15 | 25;
  days_elapsed: number;
  is_urgent: boolean;
  appointment_date: string;
  target_date: string;
  avatar_url: string;
  whatsapp_message: string;
}

export interface SpecialDateCampaign {
  id: string;
  title: string;
  tag: string;
  days_left: number;
  subtitle: string;
  banner_url: string;
  banner_headline: string;
  banner_edition: string;
  sample_message: string;
  scheduled_date: string;
  is_active: boolean;
}

export type ActiveTab = 'agenda' | 'nueva-cita' | 'recordatorios' | 'clientes';
