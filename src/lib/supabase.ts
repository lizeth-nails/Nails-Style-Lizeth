import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Client, Appointment, SmartReminder, ServiceItem, SpecialDateCampaign } from '../types/salon';
import {
  INITIAL_CLIENTS,
  INITIAL_APPOINTMENTS,
  SMART_REMINDERS_DATA,
  SERVICES_CATALOG,
  SPECIAL_DATE_CAMPAIGNS,
  TRENDS_SHOWCASE
} from './constants';

const DEFAULT_SUPABASE_URL = 'https://oliuhwirfnfatpfjuoox.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_IhLRhl-zKQjw3PNzPMxPfw_0hNTBKeZ';

const LS_SUPABASE_URL_KEY = 'nslj_supabase_url';
const LS_SUPABASE_KEY_KEY = 'nslj_supabase_anon_key';

let activeSupabaseClient: SupabaseClient | null = null;

export function getStoredSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const lsUrl = localStorage.getItem(LS_SUPABASE_URL_KEY) || '';
  const lsKey = localStorage.getItem(LS_SUPABASE_KEY_KEY) || '';

  const url = lsUrl || envUrl || DEFAULT_SUPABASE_URL;
  const key = lsKey || envKey || DEFAULT_SUPABASE_KEY;

  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http'))
  };
}

export function initSupabase(): SupabaseClient | null {
  if (activeSupabaseClient) return activeSupabaseClient;

  const { url, key, isConfigured } = getStoredSupabaseConfig();
  if (isConfigured) {
    try {
      activeSupabaseClient = createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
      return activeSupabaseClient;
    } catch (e) {
      console.warn('Error inicializando cliente Supabase:', e);
      return null;
    }
  }
  return null;
}

export function saveSupabaseCredentials(url: string, key: string) {
  localStorage.setItem(LS_SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(LS_SUPABASE_KEY_KEY, key.trim());
  activeSupabaseClient = null;
  return initSupabase();
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(LS_SUPABASE_URL_KEY);
  localStorage.removeItem(LS_SUPABASE_KEY_KEY);
  activeSupabaseClient = null;
}

export async function testConnection(url: string, key: string): Promise<{ success: boolean; message: string; tablesFound?: string[] }> {
  try {
    const testClient = createClient(url, key);
    const { data: clients, error: clientErr } = await testClient.from('clients').select('id').limit(1);

    if (clientErr) {
      if (clientErr.code === '42P01' || clientErr.message?.includes('does not exist')) {
        return {
          success: true,
          message: '¡Conexión establecida con tu proyecto de Supabase! Las tablas aún no han sido creadas. Ejecuta el script SQL en el Editor SQL de Supabase.',
          tablesFound: []
        };
      }
      return { success: false, message: `Error de Supabase: ${clientErr.message}` };
    }

    return {
      success: true,
      message: `¡Conexión exitosa! Tabla 'clients' verificada correctamente (${clients ? clients.length : 0} registros encontrados en consulta inicial).`,
      tablesFound: ['clients']
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al conectar con Supabase';
    return { success: false, message: msg };
  }
}

// ----------------- CARGA DE DATOS EXCLUSIVAMENTE DESDE SUPABASE -----------------

export async function getClients(): Promise<{ data: Client[]; source: 'supabase' | 'needs_sql'; error?: string }> {
  const client = initSupabase();
  if (!client) {
    return { data: [], source: 'needs_sql', error: 'Cliente de Supabase no inicializado' };
  }

  try {
    const { data, error } = await client
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error obteniendo clients de Supabase:', error.message);
      return { data: [], source: 'needs_sql', error: error.message };
    }

    return { data: data || [], source: 'supabase' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error de red con Supabase';
    return { data: [], source: 'needs_sql', error: msg };
  }
}

export async function createOrUpdateClient(newClient: Partial<Client>): Promise<Client> {
  const id = newClient.id || `c_${Date.now()}`;
  const fullClient: Client = {
    id,
    name: newClient.name || 'Cliente',
    gender: newClient.gender || 'female',
    phone: newClient.phone || '+57 300 000 0000',
    notes: newClient.notes || '',
    has_allergies: newClient.has_allergies ?? Boolean(newClient.notes?.toLowerCase().includes('alergia')),
    last_service_date: newClient.last_service_date || new Date().toISOString().split('T')[0],
    last_service_name: newClient.last_service_name || 'Manicure Tradicional',
    avatar_url: newClient.avatar_url,
    created_at: newClient.created_at || new Date().toISOString()
  };

  const client = initSupabase();
  if (client) {
    const { error } = await client.from('clients').upsert(fullClient);
    if (error) {
      console.error('Error guardando cliente en Supabase:', error.message);
      throw new Error(`Error Supabase: ${error.message}`);
    }
  }

  return fullClient;
}

export async function getAppointments(): Promise<{ data: Appointment[]; source: 'supabase' | 'needs_sql'; error?: string }> {
  const client = initSupabase();
  if (!client) {
    return { data: [], source: 'needs_sql', error: 'Cliente de Supabase no inicializado' };
  }

  try {
    const { data, error } = await client
      .from('appointments')
      .select('*')
      .order('numeric_id', { ascending: true });

    if (error) {
      console.warn('Error obteniendo citas de Supabase:', error.message);
      return { data: [], source: 'needs_sql', error: error.message };
    }

    return { data: data || [], source: 'supabase' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error de red con Supabase';
    return { data: [], source: 'needs_sql', error: msg };
  }
}

export async function createAppointment(newAppt: Partial<Appointment>): Promise<Appointment> {
  const client = initSupabase();
  let nextNum = 149;

  if (client) {
    try {
      const { data } = await client
        .from('appointments')
        .select('numeric_id')
        .order('numeric_id', { ascending: false })
        .limit(1);
      if (data && data.length > 0 && data[0].numeric_id) {
        nextNum = Number(data[0].numeric_id) + 1;
      }
    } catch {}
  }

  const id = newAppt.id || `#${nextNum}`;

  const fullAppt: Appointment = {
    id,
    numeric_id: nextNum,
    client_id: newAppt.client_id,
    client_name: newAppt.client_name || 'Cliente',
    client_gender: newAppt.client_gender || 'female',
    client_phone: newAppt.client_phone || '+57 300 000 0000',
    service_id: newAppt.service_id || 'semi',
    service_name: newAppt.service_name || 'Manicure Semipermanente',
    service_price: newAppt.service_price || 45000,
    date: newAppt.date || new Date().toISOString().split('T')[0],
    time: newAppt.time || '10:00 AM',
    hour_badge: (newAppt.time || '10:00 AM').split(':')[0] || '10',
    duration_text: newAppt.duration_text || '1h',
    notes: newAppt.notes || '',
    status: newAppt.status || 'confirmed',
    created_at: new Date().toISOString()
  };

  if (client) {
    const { error } = await client.from('appointments').upsert(fullAppt);
    if (error) {
      console.error('Error insertando cita en Supabase:', error.message);
      throw new Error(`Error Supabase: ${error.message}`);
    }
  }

  return fullAppt;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const client = initSupabase();
  if (client) {
    const { error } = await client.from('appointments').delete().eq('id', id);
    if (error) {
      console.error('Error eliminando cita en Supabase:', error.message);
      return false;
    }
  }
  return true;
}

export async function getReminders(): Promise<{ data: SmartReminder[]; source: 'supabase' | 'needs_sql'; error?: string }> {
  const client = initSupabase();
  if (!client) {
    return { data: [], source: 'needs_sql', error: 'Cliente de Supabase no inicializado' };
  }

  try {
    const { data, error } = await client.from('reminders').select('*');
    if (error) {
      return { data: [], source: 'needs_sql', error: error.message };
    }
    return { data: data || [], source: 'supabase' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error de red';
    return { data: [], source: 'needs_sql', error: msg };
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  const client = initSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('services').select('*');
      if (!error && data && data.length > 0) {
        return data as ServiceItem[];
      }
    } catch {}
  }
  return SERVICES_CATALOG;
}

export async function getSpecialDates(): Promise<SpecialDateCampaign[]> {
  const client = initSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('special_dates').select('*');
      if (!error && data && data.length > 0) {
        return data as SpecialDateCampaign[];
      }
    } catch {}
  }
  return SPECIAL_DATE_CAMPAIGNS;
}

export async function getTrends(): Promise<{ title: string; image: string }[]> {
  const client = initSupabase();
  if (client) {
    try {
      const { data, error } = await client.from('trends').select('*');
      if (!error && data && data.length > 0) {
        return data as { title: string; image: string }[];
      }
    } catch {}
  }
  return TRENDS_SHOWCASE;
}

// ----------------- AUTOMATED SEEDER DIRECTLY INTO SUPABASE -----------------

export async function seedAllDataToSupabase(): Promise<{ success: boolean; message: string; details?: Record<string, number> }> {
  const client = initSupabase();
  if (!client) {
    return { success: false, message: 'Cliente Supabase no configurado' };
  }

  try {
    // 1. Insert Services
    const { error: srvErr } = await client.from('services').upsert(SERVICES_CATALOG);
    if (srvErr) throw new Error(`Error en tabla services: ${srvErr.message}`);

    // 2. Insert Clients
    const { error: cliErr } = await client.from('clients').upsert(INITIAL_CLIENTS);
    if (cliErr) throw new Error(`Error en tabla clients: ${cliErr.message}`);

    // 3. Insert Appointments
    const { error: apptErr } = await client.from('appointments').upsert(INITIAL_APPOINTMENTS);
    if (apptErr) throw new Error(`Error en tabla appointments: ${apptErr.message}`);

    // 4. Insert Reminders
    const { error: remErr } = await client.from('reminders').upsert(SMART_REMINDERS_DATA);
    if (remErr) throw new Error(`Error en tabla reminders: ${remErr.message}`);

    // 5. Insert Special Dates
    const { error: spErr } = await client.from('special_dates').upsert(SPECIAL_DATE_CAMPAIGNS);
    if (spErr) throw new Error(`Error en tabla special_dates: ${spErr.message}`);

    // 6. Insert Trends
    const { error: trErr } = await client.from('trends').upsert(
      TRENDS_SHOWCASE.map((t, idx) => ({ id: `tr_${idx + 1}`, title: t.title, image: t.image }))
    );
    if (trErr) throw new Error(`Error en tabla trends: ${trErr.message}`);

    return {
      success: true,
      message: '¡Todas las tablas y registros fueron insertados con éxito en tu base de datos Supabase!',
      details: {
        servicios: SERVICES_CATALOG.length,
        clientes: INITIAL_CLIENTS.length,
        citas: INITIAL_APPOINTMENTS.length,
        recordatorios: SMART_REMINDERS_DATA.length,
        fechas_especiales: SPECIAL_DATE_CAMPAIGNS.length,
        tendencias: TRENDS_SHOWCASE.length
      }
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error durante el sembrado en Supabase';
    return { success: false, message: msg };
  }
}

// ----------------- SCRIPT SQL COMPLETO CON TABLAS Y REGISTROS -----------------

export function getSupabaseSqlSchema(): string {
  return `-- ==============================================================================
-- 💅 NAILS & STYLE LIZETH JHOANA - DDL & DATA DUMP FOR SUPABASE
-- URL: https://oliuhwirfnfatpfjuoox.supabase.co
-- Proyecto: Nails & Style Salon PWA Suite
-- Instrucciones:
--   1. Ve a https://supabase.com/dashboard/project/oliuhwirfnfatpfjuoox/sql
--   2. Pega todo este script completo y haz clic en "Run" (Ejecutar).
-- ==============================================================================

-- 1. TABLA DE SERVICIOS DEL CATÁLOGO
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  duration_text TEXT NOT NULL,
  price_cop NUMERIC NOT NULL DEFAULT 0,
  price_formatted TEXT NOT NULL,
  cycle_days INTEGER NOT NULL DEFAULT 25,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'brush',
  color_badge TEXT DEFAULT 'bg-primary',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA DE CLIENTES (VIP & REGISTRADOS)
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'female' CHECK (gender IN ('female', 'male')),
  phone TEXT NOT NULL,
  notes TEXT DEFAULT '',
  has_allergies BOOLEAN DEFAULT false,
  last_service_date TEXT,
  last_service_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA DE CITAS (AGENDA SEMANAL & DIARIA)
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  numeric_id INTEGER,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_gender TEXT NOT NULL DEFAULT 'female',
  client_phone TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price NUMERIC DEFAULT 0,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  hour_badge TEXT,
  duration_text TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA DE RECORDATORIOS INTELIGENTES
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_gender TEXT NOT NULL DEFAULT 'female',
  client_phone TEXT NOT NULL,
  service_name TEXT NOT NULL,
  cycle_days INTEGER DEFAULT 15,
  days_elapsed INTEGER DEFAULT 15,
  is_urgent BOOLEAN DEFAULT false,
  appointment_date TEXT,
  target_date TEXT,
  avatar_url TEXT,
  whatsapp_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. TABLA DE CAMPAÑAS DE FECHAS ESPECIALES
CREATE TABLE IF NOT EXISTS public.special_dates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  days_left INTEGER NOT NULL DEFAULT 8,
  subtitle TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  banner_headline TEXT NOT NULL,
  banner_edition TEXT NOT NULL,
  sample_message TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 6. TABLA DE TENDENCIAS DE LA SEMANA (INSPIRACIÓN)
CREATE TABLE IF NOT EXISTS public.trends (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- HABILITACIÓN DE ROW LEVEL SECURITY (RLS) CON ACCESO PÚBLICO AUTORIZADO
-- ==============================================================================
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-write for services" ON public.services;
DROP POLICY IF EXISTS "Allow public read-write for clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public read-write for appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public read-write for reminders" ON public.reminders;
DROP POLICY IF EXISTS "Allow public read-write for special_dates" ON public.special_dates;
DROP POLICY IF EXISTS "Allow public read-write for trends" ON public.trends;

CREATE POLICY "Allow public read-write for services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for reminders" ON public.reminders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for special_dates" ON public.special_dates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for trends" ON public.trends FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INSERCIÓN DE TODOS LOS REGISTROS REALES DE CADA TABLA
-- ==============================================================================

-- 1. REGISTROS: SERVICIOS
INSERT INTO public.services (id, name, duration_minutes, duration_text, price_cop, price_formatted, cycle_days, description, icon, color_badge)
VALUES
('semi', 'Mani & Pedi Semipermanente', 60, '60 min de sesión', 45000, '$45.000', 25, 'Ciclo recomendado de renovación: 25 días', 'brush', 'bg-[#c64673] text-[#fffbff]'),
('trad', 'Manicure y Pedicura Tradicional', 45, '45 min', 28000, '$28.000', 15, 'Ciclo recomendado: 15 días', 'clean_hands', 'bg-[#fff0f3] text-[#23191d]'),
('care', 'Retiro, Fortalecimiento y Spa', 35, '35 min', 20000, '$20.000', 20, 'Tratamiento hidratante con keratina', 'sanitizer', 'bg-[#fff0f3] text-[#23191d]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_cop = EXCLUDED.price_cop,
  price_formatted = EXCLUDED.price_formatted,
  cycle_days = EXCLUDED.cycle_days,
  description = EXCLUDED.description;

-- 2. REGISTROS: CLIENTES VIP (10 REGISTROS)
INSERT INTO public.clients (id, name, gender, phone, notes, has_allergies, last_service_date, last_service_name, avatar_url)
VALUES
('c1', 'María C.', 'female', '+57 310 456 7890', 'Alergia al látex. Prefiere esmaltado en tonos pasteles, francesa suave y retiro con torno delicado.', true, '19-01-2026', 'Semipermanente', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSeeURk99t7AkWKZbkX9nZ7tZsnFfpAFBPm7l-RCrKVIG6dGC9Ujq28SznzstvVvQ-78zv86aetD26RuaI9PB5c7Os--40I7n1vxnF_9dbyApqJyymsgvlh3ASUPxQIiP_ISs2XeEYgibewmncODtkBlIbkwZROaBR_FXrGpbrAbX-EJtVtmQRV1Qk2K-dxK4VssW7yCbX2dxGIu3LgCJ_iu5CUzcUI05patEz84KwkFKfHce6PGg'),
('c2', 'José L.', 'male', '+57 312 890 1234', 'Corte recto higiénico, exfoliación profunda, sin esmalte brillo ni pulitura brillante.', false, '29-07-2026', 'Cuidado Tradicional', 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfAV0tN-HH_nmvywF89CzGzvEeCbjXRM6NTcmy3uko8QwL2gl_RG1PbrkcOU6pOjiv7_MAkqQTJ_Fz2GgmlATeneH8r37An1oAa4xdrCGzsTaODf0sv6VbW-A1MdbMhugqqSZxWHIKMcUrjHgbxQl7QmCNtiKEKaWTm5nIx_hPFtMG2TXtR_PYaWvM90LDCQf4F6LNIuTyVFWTfC6f2IfSi-qLOMh8BrQ7YQgMjRCmWlHftZ3lBQ'),
('c3', 'Laura Valentina', 'female', '+57 315 222 3344', 'Diseño mano alzada, encapsulado con pan de oro y glitter tornasol. Requiere cita de 2 horas.', false, '19-07-2026', 'Acrílicas & Esculpidas', 'https://lh3.googleusercontent.com/aida-public/AB6AXuARDVg8ju6a93eIu3QomJ6310g9e-w6aEWJcUMVCUdWpRJHxEiolbrPGVqfp1afK6Ne0HXToN8DKEO9RNRTgFT_HMu7797QfV3ZHiIsfM7GutdlSzcvD4fyQ-NT4dNyFLiG-N1cIRD0RicBQ4RckizZiJStyoTUesRY6hzb_rAYil3cI4uLMxKBHDrIYjfksMZbxNGc06QtxVFQI-gTxHAclw4Qi69rUXSVe21YDS1VlZ9fNDMK7Vc'),
('c4', 'David Gómez', 'male', '+57 320 111 8899', 'Pedicura spa mensual obligatoria. Talones secos con necesidad de hidratación de parafina y masaje relajante.', true, '05-01-2026', 'Pedicura Spa & Podología', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOqaijuPp-sTcVTuF7UOyPZiGgrj6vUeppJlSCn48tBitItCf0qRzKg5iIODRYdnWoiUzXDviY2Co3p-d9_LE_uhR8vxRBIOlzpEom5VcRaWnR__BoZYJzoG0e6E8MBTigaPWqFhDqEd2whwMIjtjeDxOccex674joQqDT8dcSnj6ivKKIeMgHCViSgT28h5MyjTltZ7OkGExqy9EsyNF-7WOfpAVCEd4He1VkTs6fH-ksgZJOVJM'),
('c5', 'Carlos R.', 'male', '+57 311 555 4321', 'Manicure tradicional caballero. Cuidado de cutículas e hidratación.', false, '22-09-2026', 'Manicure Tradicional', NULL),
('c6', 'Sofía G.', 'female', '+57 318 765 4321', 'Pedicura Completa Spa. Exfoliación e hidratación profunda con sales marinas.', false, '22-09-2026', 'Pedicura Completa Spa', NULL),
('c7', 'Laura M.', 'female', '+57 301 987 6543', 'Retiro y Semipermanente. Diseño floral con perlas y acabado gloss.', false, '22-09-2026', 'Retiro y Semipermanente', NULL),
('c8', 'Marcela Torres', 'female', '+57 315 789 4432', 'Uñas frágiles, prefiere tonos nude y francesa sutil. Alergia leve a removedores con fragancia artificial.', true, '22-09-2026', 'Mani & Pedi Semipermanente', NULL),
('c9', 'Andrés Felipe', 'male', '+57 314 333 5566', 'Manicure spa masculino. Exfoliación de manos y limado natural deportivo.', false, '24-09-2026', 'Manicure Spa Deportivo', NULL),
('c10', 'Camila Rivas', 'female', '+57 316 888 9900', 'Uñas esculpidas en gel con técnica baby boomer y baño de queratina.', false, '24-09-2026', 'Baby Boomer & Queratina', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  phone = EXCLUDED.phone,
  notes = EXCLUDED.notes,
  has_allergies = EXCLUDED.has_allergies,
  last_service_date = EXCLUDED.last_service_date,
  last_service_name = EXCLUDED.last_service_name;

-- 3. REGISTROS: CITAS EN AGENDA (10 REGISTROS)
INSERT INTO public.appointments (id, numeric_id, client_id, client_name, client_gender, client_phone, service_id, service_name, service_price, date, time, hour_badge, duration_text, notes, status)
VALUES
('#145', 145, 'c1', 'María C.', 'female', '+57 310 456 7890', 'semi', 'Manicure Semipermanente', 45000, '2026-09-22', '10:00 AM', '10', '1h 30m', 'Diseño sutil, tonos nude pastel', 'confirmed'),
('#146', 146, 'c5', 'Carlos R.', 'male', '+57 311 555 4321', 'trad', 'Manicure Tradicional Caballero', 28000, '2026-09-22', '11:30 AM', '11', '45m', 'Cuidado de cutículas', 'confirmed'),
('#147', 147, 'c6', 'Sofía G.', 'female', '+57 318 765 4321', 'semi', 'Pedicura Completa Spa', 45000, '2026-09-22', '02:00 PM', '02', '1h 15m', 'Exfoliación e hidratación', 'confirmed'),
('#148', 148, 'c7', 'Laura M.', 'female', '+57 301 987 6543', 'care', 'Retiro y Semipermanente', 45000, '2026-09-22', '04:30 PM', '04', '1h 30m', 'Diseño floral con perlas', 'confirmed'),
('#149', 149, 'c8', 'Marcela Torres', 'female', '+57 315 789 4432', 'semi', 'Mani & Pedi Semipermanente', 45000, '2026-09-22', '06:00 PM', '06', '1h', 'Tonos nude y francesa sutil', 'confirmed'),
('#150', 150, 'c2', 'José L.', 'male', '+57 312 890 1234', 'trad', 'Cuidado Tradicional Caballero', 28000, '2026-09-23', '09:30 AM', '09', '45m', 'Exfoliación y corte recto', 'confirmed'),
('#151', 151, 'c3', 'Laura Valentina', 'female', '+57 315 222 3344', 'semi', 'Acrílicas & Esculpidas', 65000, '2026-09-23', '11:00 AM', '11', '2h', 'Encapsulado con pan de oro', 'confirmed'),
('#152', 152, 'c4', 'David Gómez', 'male', '+57 320 111 8899', 'care', 'Pedicura Spa & Podología', 35000, '2026-09-23', '03:00 PM', '03', '1h 15m', 'Hidratación con parafina', 'confirmed'),
('#153', 153, 'c9', 'Andrés Felipe', 'male', '+57 314 333 5566', 'trad', 'Manicure Spa Deportivo', 28000, '2026-09-24', '10:30 AM', '10', '45m', 'Limado natural y masaje', 'confirmed'),
('#154', 154, 'c10', 'Camila Rivas', 'female', '+57 316 888 9900', 'semi', 'Baby Boomer & Queratina', 50000, '2026-09-24', '02:30 PM', '02', '1h 30m', 'Baño de queratina y degradado', 'confirmed')
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  service_name = EXCLUDED.service_name,
  status = EXCLUDED.status;

-- 4. REGISTROS: RECORDATORIOS INTELIGENTES (10 REGISTROS)
INSERT INTO public.reminders (id, client_id, client_name, client_gender, client_phone, service_name, cycle_days, days_elapsed, is_urgent, appointment_date, target_date, avatar_url, whatsapp_message)
VALUES
('r1', 'c1', 'María C.', 'female', '+57 310 456 7890', 'Manicure Tradicional', 15, 15, false, '2026-09-07', '2026-09-22', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSeeURk99t7AkWKZbkX9nZ7tZsnFfpAFBPm7l-RCrKVIG6dGC9Ujq28SznzstvVvQ-78zv86aetD26RuaI9PB5c7Os--40I7n1vxnF_9dbyApqJyymsgvlh3ASUPxQIiP_ISs2XeEYgibewmncODtkBlIbkwZROaBR_FXrGpbrAbX-EJtVtmQRV1Qk2K-dxK4VssW7yCbX2dxGIu3LgCJ_iu5CUzcUI05patEz84KwkFKfHce6PGg', '¡Hola María! ✨ Te recordamos que han pasado 15 días desde tu manicure tradicional. ¡Es momento de consentir tus manos en Nails & Style Lizeth Jhoana! 💅🌸'),
('r2', 'c2', 'José L.', 'male', '+57 312 890 1234', 'Semipermanente Caballero', 25, 25, true, '2026-08-28', '2026-09-22', 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfAV0tN-HH_nmvywF89CzGzvEeCbjXRM6NTcmy3uko8QwL2gl_RG1PbrkcOU6pOjiv7_MAkqQTJ_Fz2GgmlATeneH8r37An1oAa4xdrCGzsTaODf0sv6VbW-A1MdbMhugqqSZxWHIKMcUrjHgbxQl7QmCNtiKEKaWTm5nIx_hPFtMG2TXtR_PYaWvM90LDCQf4F6LNIuTyVFWTfC6f2IfSi-qLOMh8BrQ7YQgMjRCmWlHftZ3lBQ', '¡Hola José! Te escribimos de Nails & Style Lizeth Jhoana para recordarte el mantenimiento de tus uñas semipermanentes. ¡Agenda tu cita para mantenerlas impecables! ✨✂️'),
('r3', 'c8', 'Marcela Torres', 'female', '+57 315 789 4432', 'Mani & Pedi Semipermanente', 25, 25, false, '2026-08-28', '2026-09-22', '', '¡Hola Marcela! ✨ Han pasado 25 días desde tu última sesión de Semipermanente. ¡Reserva tu turno para renovación en Nails & Style Lizeth Jhoana! 💅💖'),
('r4', 'c3', 'Laura Valentina', 'female', '+57 315 222 3344', 'Acrílicas Esculpidas', 25, 24, true, '2026-08-29', '2026-09-23', 'https://lh3.googleusercontent.com/aida-public/AB6AXuARDVg8ju6a93eIu3QomJ6310g9e-w6aEWJcUMVCUdWpRJHxEiolbrPGVqfp1afK6Ne0HXToN8DKEO9RNRTgFT_HMu7797QfV3ZHiIsfM7GutdlSzcvD4fyQ-NT4dNyFLiG-N1cIRD0RicBQ4RckizZiJStyoTUesRY6hzb_rAYil3cI4uLMxKBHDrIYjfksMZbxNGc06QtxVFQI-gTxHAclw4Qi69rUXSVe21YDS1VlZ9fNDMK7Vc', '¡Hola Laura Valentina! 💖 Es hora del retoque de tus acrílicas encapsuladas. ¡Asegura tu cita con Lizeth Jhoana para lucir uñas perfectas! 💅✨'),
('r5', 'c4', 'David Gómez', 'male', '+57 320 111 8899', 'Pedicura Spa & Podología', 25, 25, false, '2026-08-28', '2026-09-22', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOqaijuPp-sTcVTuF7UOyPZiGgrj6vUeppJlSCn48tBitItCf0qRzKg5iIODRYdnWoiUzXDviY2Co3p-d9_LE_uhR8vxRBIOlzpEom5VcRaWnR__BoZYJzoG0e6E8MBTigaPWqFhDqEd2whwMIjtjeDxOccex674joQqDT8dcSnj6ivKKIeMgHCViSgT28h5MyjTltZ7OkGExqy9EsyNF-7WOfpAVCEd4He1VkTs6fH-ksgZJOVJM', 'Estimado David, te saludamos de Nails & Style Lizeth Jhoana para recordarte tu sesión mensual de pedicura spa y parafina. ¡Te esperamos! 💈🦶'),
('r6', 'c5', 'Carlos R.', 'male', '+57 311 555 4321', 'Manicure Tradicional Caballero', 15, 15, false, '2026-09-07', '2026-09-22', '', '¡Hola Carlos! Ya se cumplieron 15 días de tu manicure. Agenda tu turno para mantener el cuidado de cutículas en Nails & Style. ✂️✨'),
('r7', 'c6', 'Sofía G.', 'female', '+57 318 765 4321', 'Pedicura Completa Spa', 25, 25, true, '2026-08-28', '2026-09-22', '', '¡Hola Sofía! 🌸 Ya es momento de renovar tu pedicura completa spa. ¡Ven a relajarte y consentirte en Nails & Style Lizeth Jhoana! 💅💆‍♀️'),
('r8', 'c7', 'Laura M.', 'female', '+57 301 987 6543', 'Retiro y Semipermanente', 25, 25, false, '2026-08-28', '2026-09-22', '', '¡Hola Laura! ✨ Te recordamos agendar el retiro y nuevo esmaltado semipermanente para mantener tus uñas saludables y fuertes. 💅🌸'),
('r9', 'c9', 'Andrés Felipe', 'male', '+57 314 333 5566', 'Manicure Spa Deportivo', 15, 15, false, '2026-09-07', '2026-09-22', '', '¡Hola Andrés! Te saludamos de Nails & Style para recordarte tu turno de manicure tradicional y cuidado de manos. ¡Agenda cuando gustes! ✂️💈'),
('r10', 'c10', 'Camila Rivas', 'female', '+57 316 888 9900', 'Baby Boomer & Queratina', 25, 25, true, '2026-08-28', '2026-09-22', '', '¡Hola Camila! 💖 Han pasado 25 días de tu esmaltado Baby Boomer. ¡Te esperamos en Nails & Style Lizeth Jhoana para consentir tus manos! 💅✨')
ON CONFLICT (id) DO UPDATE SET
  whatsapp_message = EXCLUDED.whatsapp_message,
  days_elapsed = EXCLUDED.days_elapsed,
  is_urgent = EXCLUDED.is_urgent;

-- 5. REGISTROS: FECHAS ESPECIALES
INSERT INTO public.special_dates (id, title, tag, days_left, subtitle, banner_url, banner_headline, banner_edition, sample_message, scheduled_date, is_active)
VALUES
('sp1', 'Día de la Madre', 'Faltan 8 días', 8, 'Campaña de agendamiento preventivo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcJWN_HhYzUxZTG_i8q_zMXrCU7D3ShSYXEqzfJizEuOJCK8phJ9w0RZdY3Pc2m7Ryu0XVzryiIvdKWEmnUOhdZfpxTwvyXAQc86e-69khF3wwwx5WTMzg26tecKUAud-FqZWsCW54mppWPjLVcIWkFMNR7RvJmzYxg5LMrL36FsnE8VUILES2XwgoXPVEl3UJ3KVc5f_C6woKgfXtXDhvwf8elH6Ne5OWOhsxtb3dctY-SVUsvvo', 'Consiéntela con Amor', 'Edición Especial', '🌸 ¡Se acerca el Día de la Madre! Asegura tu turno con anticipación en Nails & Style Lizeth Jhoana y regálale a mamá (o regálate a ti) un día de manicura inolvidable. ¡Cupos limitados! 💖🎁', 'Mayo 2026', true),
('sp2', 'Amor y Amistad', 'Alerta programada', 14, 'Alerta programada para el 12 de Septiembre', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZOnel49v_g4dq-qKzYDW5HZTPEZ5g-YpHxCv_ZdhqYeoSEgYKzYAVbbfIexkaJzBPO23-FDbGO7tH-owlRkBhFL0MPSgCwBNyoK_u4hmAxJu-ygI0phyvO9tvE6KjLzYHFA96Z0L41j1GlEzxYoNAdx1y7sSRD4-V5jVbXPH941Cxr3N7OoaUkUvf5N4PzHo-Sk-BfIim72mQXVaA9Q9_GuoQ0kkBBKZTmbJyXZuJjYRLq3H1T-c', 'Celebra la Amistad', 'Promoción Dúo', '💖 ¡Llega Amor y Amistad! Ven con tu amiga, pareja o consentida a Nails & Style Lizeth Jhoana y disfruten de un combo manicure con diseño de cortesía. 🥂💅', '12 de Septiembre', false)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  sample_message = EXCLUDED.sample_message;

-- 6. REGISTROS: TENDENCIAS
INSERT INTO public.trends (id, title, image)
VALUES
('tr1', 'Rose Gold Nude', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZOnel49v_g4dq-qKzYDW5HZTPEZ5g-YpHxCv_ZdhqYeoSEgYKzYAVbbfIexkaJzBPO23-FDbGO7tH-owlRkBhFL0MPSgCwBNyoK_u4hmAxJu-ygI0phyvO9tvE6KjLzYHFA96Z0L41j1GlEzxYoNAdx1y7sSRD4-V5jVbXPH941Cxr3N7OoaUkUvf5N4PzHo-Sk-BfIim72mQXVaA9Q9_GuoQ0kkBBKZTmbJyXZuJjYRLq3H1T-c'),
('tr2', 'Glazed Pearl', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5_0LYkiZD8UORQ-5UOI-Ov2p7G76W0MEue-zt9oKav3xyzkxE5dm1h7I91SYTEtEH3Cd7MaBXLqogXEasQcZl7yx7U9zPOQGm5z8rPsivXvnyZdLZS3jZjlL65VQUTRnt1rxajiJGwbo0G6P4CYcv09PdnXDgWzvhePgFKoW0NSitXECiCHjLlwXQiPoW9TP4ue1ke7jalaTOS4vDpM-jLvGIsATFg9ufl_v_6NyMzEwIcIn944')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image;
`;
}
