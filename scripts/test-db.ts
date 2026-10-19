import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oliuhwirfnfatpfjuoox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_IhLRhl-zKQjw3PNzPMxPfw_0hNTBKeZ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAndSeed() {
  console.log('--- Probando conexión con Supabase ---');
  console.log('URL:', SUPABASE_URL);

  // Check services
  const { data: srvData, error: srvErr } = await supabase.from('services').select('*').limit(1);
  console.log('services check:', { srvData, srvErr });

  // Check clients
  const { data: cliData, error: cliErr } = await supabase.from('clients').select('*').limit(1);
  console.log('clients check:', { cliData, cliErr });

  // Check appointments
  const { data: apptData, error: apptErr } = await supabase.from('appointments').select('*').limit(1);
  console.log('appointments check:', { apptData, apptErr });

  // Check reminders
  const { data: remData, error: remErr } = await supabase.from('reminders').select('*').limit(1);
  console.log('reminders check:', { remData, remErr });
}

checkAndSeed().catch(console.error);
