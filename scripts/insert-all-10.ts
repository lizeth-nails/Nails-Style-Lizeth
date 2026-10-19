import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_CLIENTS,
  INITIAL_APPOINTMENTS,
  SMART_REMINDERS_DATA,
  SERVICES_CATALOG,
  SPECIAL_DATE_CAMPAIGNS,
  TRENDS_SHOWCASE
} from '../src/lib/constants';

const SUPABASE_URL = 'https://oliuhwirfnfatpfjuoox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_IhLRhl-zKQjw3PNzPMxPfw_0hNTBKeZ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertAll() {
  console.log('Iniciando guardado de datos en Supabase:', SUPABASE_URL);

  // 1. Guardar Servicios
  console.log('\n1. Insertando servicios...');
  const { data: srvResult, error: srvErr } = await supabase
    .from('services')
    .upsert(SERVICES_CATALOG)
    .select();
  if (srvErr) {
    console.error('Error en servicios:', srvErr.message);
  } else {
    console.log(`✓ ${srvResult?.length || SERVICES_CATALOG.length} servicios guardados.`);
  }

  // 2. Guardar 10 Clientes
  console.log('\n2. Insertando 10 clientes VIP...');
  const { data: cliResult, error: cliErr } = await supabase
    .from('clients')
    .upsert(INITIAL_CLIENTS)
    .select();
  if (cliErr) {
    console.error('Error en clientes:', cliErr.message);
  } else {
    console.log(`✓ ${cliResult?.length || INITIAL_CLIENTS.length} clientes guardados.`);
  }

  // 3. Guardar 10 Citas
  console.log('\n3. Insertando 10 citas en la agenda...');
  const { data: apptResult, error: apptErr } = await supabase
    .from('appointments')
    .upsert(INITIAL_APPOINTMENTS)
    .select();
  if (apptErr) {
    console.error('Error en appointments:', apptErr.message);
  } else {
    console.log(`✓ ${apptResult?.length || INITIAL_APPOINTMENTS.length} citas guardadas.`);
  }

  // 4. Guardar 10 Recordatorios
  console.log('\n4. Insertando 10 recordatorios inteligentes...');
  const { data: remResult, error: remErr } = await supabase
    .from('reminders')
    .upsert(SMART_REMINDERS_DATA)
    .select();
  if (remErr) {
    console.error('Error en reminders:', remErr.message);
  } else {
    console.log(`✓ ${remResult?.length || SMART_REMINDERS_DATA.length} recordatorios guardados.`);
  }

  // 5. Guardar Fechas Especiales
  console.log('\n5. Insertando campañas de fechas especiales...');
  const { data: spResult, error: spErr } = await supabase
    .from('special_dates')
    .upsert(SPECIAL_DATE_CAMPAIGNS)
    .select();
  if (spErr) {
    console.error('Error en special_dates:', spErr.message);
  } else {
    console.log(`✓ ${spResult?.length || SPECIAL_DATE_CAMPAIGNS.length} campañas guardadas.`);
  }

  // 6. Guardar Tendencias
  console.log('\n6. Insertando tendencias...');
  const trendsData = TRENDS_SHOWCASE.map((t, idx) => ({
    id: `tr_${idx + 1}`,
    title: t.title,
    image: t.image
  }));
  const { data: trResult, error: trErr } = await supabase
    .from('trends')
    .upsert(trendsData)
    .select();
  if (trErr) {
    console.error('Error en trends:', trErr.message);
  } else {
    console.log(`✓ ${trResult?.length || trendsData.length} tendencias guardadas.`);
  }

  // Verificación final consultando las tablas
  console.log('\n=== VERIFICACIÓN FINAL DIRECTA DESDE SUPABASE ===');
  const { count: countClients } = await supabase.from('clients').select('*', { count: 'exact', head: true });
  const { count: countAppts } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
  const { count: countReminders } = await supabase.from('reminders').select('*', { count: 'exact', head: true });
  const { count: countServices } = await supabase.from('services').select('*', { count: 'exact', head: true });

  console.log(`Total Clientes en Supabase: ${countClients}`);
  console.log(`Total Citas en Supabase: ${countAppts}`);
  console.log(`Total Recordatorios en Supabase: ${countReminders}`);
  console.log(`Total Servicios en Supabase: ${countServices}`);
}

insertAll().catch(console.error);
