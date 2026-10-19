import { Client, ServiceItem, Appointment, SpecialDateCampaign, SmartReminder } from '../types/salon';

export const SALON_INFO = {
  name: "Lizeth Jhoana",
  brand: "Nails & Style",
  title: "Nails & Style Lizeth Jhoana",
  role: "Acceso Administradora",
  defaultPin: "2026",
  quickPinAlt: "1234",
  recoveryEmail: "lizeth@nailsandstyle.com",
  phonePrefix: "+57",
  logoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XYIrf3kVFzgD-yDmCptL3TQpE1L1EenHiiNBUrpguzjfTMVRCCTwmqTrlkKqvV9O2RPT0tEwvQ6qcPEttlxGso66gMfpWyTRm4s1IWJNjLRd3cCWtwdmJ-te33kkvtFoHQAPrR-vzXlDskVtPoLmJufh8Kq96xuNMcKsoQoVatarmfqdIrddcyap1j5VNW-0qsO70HSe43TKSSjawzSainE0lWWEFRoQsNXFtnDswq7JGChvsaNMHMO4BXQZH7iRibl_wJGHkm",
  crownLogoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTAnT89U66UhP5GR3xH1oV4GZrZygvb_WCwAoMtwjRSKiVZEnoYdj_tVQVATHGFzBJhzNvqcLfhgG4Ha0yV8_pTih3UU_4IAcN8yvD890GOJAu4gm2FRl3vHPs5tTQabEJoOlrFRNaSqTRf3rvMXoIignhStGGCtjC_F2kPX9LNo9lJ0cUJIFVfihjDpCMzPJAKKDkQL4Gy8UuL7jRNzQCqqfzIJpIPD9cRVI-vcayM7O0rzi-5WmOZhh7apBPEAIP"
};

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'semi',
    name: 'Mani & Pedi Semipermanente',
    duration_minutes: 60,
    duration_text: '60 min de sesión',
    price_cop: 45000,
    price_formatted: '$45.000',
    cycle_days: 25,
    description: 'Ciclo recomendado de renovación: 25 días',
    icon: 'brush',
    color_badge: 'bg-[#c64673] text-[#fffbff]'
  },
  {
    id: 'trad',
    name: 'Manicure y Pedicura Tradicional',
    duration_minutes: 45,
    duration_text: '45 min',
    price_cop: 28000,
    price_formatted: '$28.000',
    cycle_days: 15,
    description: 'Ciclo recomendado: 15 días',
    icon: 'clean_hands',
    color_badge: 'bg-[#fff0f3] text-[#23191d]'
  },
  {
    id: 'care',
    name: 'Retiro, Fortalecimiento y Spa',
    duration_minutes: 35,
    duration_text: '35 min',
    price_cop: 20000,
    price_formatted: '$20.000',
    cycle_days: 20,
    description: 'Tratamiento hidratante con keratina',
    icon: 'sanitizer',
    color_badge: 'bg-[#fff0f3] text-[#23191d]'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'María C.',
    gender: 'female',
    phone: '+57 310 456 7890',
    notes: 'Alergia al látex. Prefiere esmaltado en tonos pasteles, francesa suave y retiro con torno delicado.',
    has_allergies: true,
    last_service_date: '19-01-2026',
    last_service_name: 'Semipermanente',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSeeURk99t7AkWKZbkX9nZ7tZsnFfpAFBPm7l-RCrKVIG6dGC9Ujq28SznzstvVvQ-78zv86aetD26RuaI9PB5c7Os--40I7n1vxnF_9dbyApqJyymsgvlh3ASUPxQIiP_ISs2XeEYgibewmncODtkBlIbkwZROaBR_FXrGpbrAbX-EJtVtmQRV1Qk2K-dxK4VssW7yCbX2dxGIu3LgCJ_iu5CUzcUI05patEz84KwkFKfHce6PGg'
  },
  {
    id: 'c2',
    name: 'José L.',
    gender: 'male',
    phone: '+57 312 890 1234',
    notes: 'Corte recto higiénico, exfoliación profunda, sin esmalte brillo ni pulitura brillante.',
    has_allergies: false,
    last_service_date: '29-07-2026',
    last_service_name: 'Cuidado Tradicional',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfAV0tN-HH_nmvywF89CzGzvEeCbjXRM6NTcmy3uko8QwL2gl_RG1PbrkcOU6pOjiv7_MAkqQTJ_Fz2GgmlATeneH8r37An1oAa4xdrCGzsTaODf0sv6VbW-A1MdbMhugqqSZxWHIKMcUrjHgbxQl7QmCNtiKEKaWTm5nIx_hPFtMG2TXtR_PYaWvM90LDCQf4F6LNIuTyVFWTfC6f2IfSi-qLOMh8BrQ7YQgMjRCmWlHftZ3lBQ'
  },
  {
    id: 'c3',
    name: 'Laura Valentina',
    gender: 'female',
    phone: '+57 315 222 3344',
    notes: 'Diseño mano alzada, encapsulado con pan de oro y glitter tornasol. Requiere cita de 2 horas.',
    has_allergies: false,
    last_service_date: '19-07-2026',
    last_service_name: 'Acrílicas & Esculpidas',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARDVg8ju6a93eIu3QomJ6310g9e-w6aEWJcUMVCUdWpRJHxEiolbrPGVqfp1afK6Ne0HXToN8DKEO9RNRTgFT_HMu7797QfV3ZHiIsfM7GutdlSzcvD4fyQ-NT4dNyFLiG-N1cIRD0RicBQ4RckizZiJStyoTUesRY6hzb_rAYil3cI4uLMxKBHDrIYjfksMZbxNGc06QtxVFQI-gTxHAclw4Qi69rUXSVe21YDS1VlZ9fNDMK7Vc'
  },
  {
    id: 'c4',
    name: 'David Gómez',
    gender: 'male',
    phone: '+57 320 111 8899',
    notes: 'Pedicura spa mensual obligatoria. Talones secos con necesidad de hidratación de parafina y masaje relajante.',
    has_allergies: true,
    last_service_date: '05-01-2026',
    last_service_name: 'Pedicura Spa & Podología',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOqaijuPp-sTcVTuF7UOyPZiGgrj6vUeppJlSCn48tBitItCf0qRzKg5iIODRYdnWoiUzXDviY2Co3p-d9_LE_uhR8vxRBIOlzpEom5VcRaWnR__BoZYJzoG0e6E8MBTigaPWqFhDqEd2whwMIjtjeDxOccex674joQqDT8dcSnj6ivKKIeMgHCViSgT28h5MyjTltZ7OkGExqy9EsyNF-7WOfpAVCEd4He1VkTs6fH-ksgZJOVJM'
  },
  {
    id: 'c5',
    name: 'Carlos R.',
    gender: 'male',
    phone: '+57 311 555 4321',
    notes: 'Manicure tradicional caballero. Cuidado de cutículas e hidratación.',
    has_allergies: false,
    last_service_date: '22-09-2026',
    last_service_name: 'Manicure Tradicional'
  },
  {
    id: 'c6',
    name: 'Sofía G.',
    gender: 'female',
    phone: '+57 318 765 4321',
    notes: 'Pedicura Completa Spa. Exfoliación e hidratación profunda con sales marinas.',
    has_allergies: false,
    last_service_date: '22-09-2026',
    last_service_name: 'Pedicura Completa Spa'
  },
  {
    id: 'c7',
    name: 'Laura M.',
    gender: 'female',
    phone: '+57 301 987 6543',
    notes: 'Retiro y Semipermanente. Diseño floral con perlas y acabado gloss.',
    has_allergies: false,
    last_service_date: '22-09-2026',
    last_service_name: 'Retiro y Semipermanente'
  },
  {
    id: 'c8',
    name: 'Marcela Torres',
    gender: 'female',
    phone: '+57 315 789 4432',
    notes: 'Uñas frágiles, prefiere tonos nude y francesa sutil. Alergia leve a removedores con fragancia artificial.',
    has_allergies: true,
    last_service_date: '22-09-2026',
    last_service_name: 'Mani & Pedi Semipermanente'
  },
  {
    id: 'c9',
    name: 'Andrés Felipe',
    gender: 'male',
    phone: '+57 314 333 5566',
    notes: 'Manicure spa masculino. Exfoliación de manos y limado natural deportivo.',
    has_allergies: false,
    last_service_date: '24-09-2026',
    last_service_name: 'Manicure Spa Deportivo'
  },
  {
    id: 'c10',
    name: 'Camila Rivas',
    gender: 'female',
    phone: '+57 316 888 9900',
    notes: 'Uñas esculpidas en gel con técnica baby boomer y baño de queratina.',
    has_allergies: false,
    last_service_date: '24-09-2026',
    last_service_name: 'Baby Boomer & Queratina'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '#145',
    numeric_id: 145,
    client_id: 'c1',
    client_name: 'María C.',
    client_gender: 'female',
    client_phone: '+57 310 456 7890',
    service_id: 'semi',
    service_name: 'Manicure Semipermanente',
    service_price: 45000,
    date: '2026-09-22',
    time: '10:00 AM',
    hour_badge: '10',
    duration_text: '1h 30m',
    notes: 'Diseño sutil, tonos nude pastel',
    status: 'confirmed'
  },
  {
    id: '#146',
    numeric_id: 146,
    client_id: 'c5',
    client_name: 'Carlos R.',
    client_gender: 'male',
    client_phone: '+57 311 555 4321',
    service_id: 'trad',
    service_name: 'Manicure Tradicional Caballero',
    service_price: 28000,
    date: '2026-09-22',
    time: '11:30 AM',
    hour_badge: '11',
    duration_text: '45m',
    notes: 'Cuidado de cutículas',
    status: 'confirmed'
  },
  {
    id: '#147',
    numeric_id: 147,
    client_id: 'c6',
    client_name: 'Sofía G.',
    client_gender: 'female',
    client_phone: '+57 318 765 4321',
    service_id: 'semi',
    service_name: 'Pedicura Completa Spa',
    service_price: 45000,
    date: '2026-09-22',
    time: '02:00 PM',
    hour_badge: '02',
    duration_text: '1h 15m',
    notes: 'Exfoliación e hidratación',
    status: 'confirmed'
  },
  {
    id: '#148',
    numeric_id: 148,
    client_id: 'c7',
    client_name: 'Laura M.',
    client_gender: 'female',
    client_phone: '+57 301 987 6543',
    service_id: 'care',
    service_name: 'Retiro y Semipermanente',
    service_price: 45000,
    date: '2026-09-22',
    time: '04:30 PM',
    hour_badge: '04',
    duration_text: '1h 30m',
    notes: 'Diseño floral con perlas',
    status: 'confirmed'
  },
  {
    id: '#149',
    numeric_id: 149,
    client_id: 'c8',
    client_name: 'Marcela Torres',
    client_gender: 'female',
    client_phone: '+57 315 789 4432',
    service_id: 'semi',
    service_name: 'Mani & Pedi Semipermanente',
    service_price: 45000,
    date: '2026-09-22',
    time: '06:00 PM',
    hour_badge: '06',
    duration_text: '1h',
    notes: 'Tonos nude y francesa sutil',
    status: 'confirmed'
  },
  {
    id: '#150',
    numeric_id: 150,
    client_id: 'c2',
    client_name: 'José L.',
    client_gender: 'male',
    client_phone: '+57 312 890 1234',
    service_id: 'trad',
    service_name: 'Cuidado Tradicional Caballero',
    service_price: 28000,
    date: '2026-09-23',
    time: '09:30 AM',
    hour_badge: '09',
    duration_text: '45m',
    notes: 'Exfoliación y corte recto',
    status: 'confirmed'
  },
  {
    id: '#151',
    numeric_id: 151,
    client_id: 'c3',
    client_name: 'Laura Valentina',
    client_gender: 'female',
    client_phone: '+57 315 222 3344',
    service_id: 'semi',
    service_name: 'Acrílicas & Esculpidas',
    service_price: 65000,
    date: '2026-09-23',
    time: '11:00 AM',
    hour_badge: '11',
    duration_text: '2h',
    notes: 'Encapsulado con pan de oro',
    status: 'confirmed'
  },
  {
    id: '#152',
    numeric_id: 152,
    client_id: 'c4',
    client_name: 'David Gómez',
    client_gender: 'male',
    client_phone: '+57 320 111 8899',
    service_id: 'care',
    service_name: 'Pedicura Spa & Podología',
    service_price: 35000,
    date: '2026-09-23',
    time: '03:00 PM',
    hour_badge: '03',
    duration_text: '1h 15m',
    notes: 'Hidratación con parafina',
    status: 'confirmed'
  },
  {
    id: '#153',
    numeric_id: 153,
    client_id: 'c9',
    client_name: 'Andrés Felipe',
    client_gender: 'male',
    client_phone: '+57 314 333 5566',
    service_id: 'trad',
    service_name: 'Manicure Spa Deportivo',
    service_price: 28000,
    date: '2026-09-24',
    time: '10:30 AM',
    hour_badge: '10',
    duration_text: '45m',
    notes: 'Limado natural y masaje',
    status: 'confirmed'
  },
  {
    id: '#154',
    numeric_id: 154,
    client_id: 'c10',
    client_name: 'Camila Rivas',
    client_gender: 'female',
    client_phone: '+57 316 888 9900',
    service_id: 'semi',
    service_name: 'Baby Boomer & Queratina',
    service_price: 50000,
    date: '2026-09-24',
    time: '02:30 PM',
    hour_badge: '02',
    duration_text: '1h 30m',
    notes: 'Baño de queratina y degradado',
    status: 'confirmed'
  }
];

export const SMART_REMINDERS_DATA: SmartReminder[] = [
  {
    id: 'r1',
    client_id: 'c1',
    client_name: 'María C.',
    client_gender: 'female',
    client_phone: '+57 310 456 7890',
    service_name: 'Manicure Tradicional',
    cycle_days: 15,
    days_elapsed: 15,
    is_urgent: false,
    appointment_date: '2026-09-07',
    target_date: '2026-09-22',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSeeURk99t7AkWKZbkX9nZ7tZsnFfpAFBPm7l-RCrKVIG6dGC9Ujq28SznzstvVvQ-78zv86aetD26RuaI9PB5c7Os--40I7n1vxnF_9dbyApqJyymsgvlh3ASUPxQIiP_ISs2XeEYgibewmncODtkBlIbkwZROaBR_FXrGpbrAbX-EJtVtmQRV1Qk2K-dxK4VssW7yCbX2dxGIu3LgCJ_iu5CUzcUI05patEz84KwkFKfHce6PGg',
    whatsapp_message: "¡Hola María! ✨ Te recordamos que han pasado 15 días desde tu manicure tradicional. ¡Es momento de consentir tus manos en Nails & Style Lizeth Jhoana! 💅🌸"
  },
  {
    id: 'r2',
    client_id: 'c2',
    client_name: 'José L.',
    client_gender: 'male',
    client_phone: '+57 312 890 1234',
    service_name: 'Semipermanente Caballero',
    cycle_days: 25,
    days_elapsed: 25,
    is_urgent: true,
    appointment_date: '2026-08-28',
    target_date: '2026-09-22',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfAV0tN-HH_nmvywF89CzGzvEeCbjXRM6NTcmy3uko8QwL2gl_RG1PbrkcOU6pOjiv7_MAkqQTJ_Fz2GgmlATeneH8r37An1oAa4xdrCGzsTaODf0sv6VbW-A1MdbMhugqqSZxWHIKMcUrjHgbxQl7QmCNtiKEKaWTm5nIx_hPFtMG2TXtR_PYaWvM90LDCQf4F6LNIuTyVFWTfC6f2IfSi-qLOMh8BrQ7YQgMjRCmWlHftZ3lBQ',
    whatsapp_message: "¡Hola José! Te escribimos de Nails & Style Lizeth Jhoana para recordarte el mantenimiento de tus uñas semipermanentes. ¡Agenda tu cita para mantenerlas impecables! ✨✂️"
  },
  {
    id: 'r3',
    client_id: 'c8',
    client_name: 'Marcela Torres',
    client_gender: 'female',
    client_phone: '+57 315 789 4432',
    service_name: 'Mani & Pedi Semipermanente',
    cycle_days: 25,
    days_elapsed: 25,
    is_urgent: false,
    appointment_date: '2026-08-28',
    target_date: '2026-09-22',
    avatar_url: '',
    whatsapp_message: "¡Hola Marcela! ✨ Han pasado 25 días desde tu última sesión de Semipermanente. ¡Reserva tu turno para renovación en Nails & Style Lizeth Jhoana! 💅💖"
  },
  {
    id: 'r4',
    client_id: 'c3',
    client_name: 'Laura Valentina',
    client_gender: 'female',
    client_phone: '+57 315 222 3344',
    service_name: 'Acrílicas Esculpidas',
    cycle_days: 25,
    days_elapsed: 24,
    is_urgent: true,
    appointment_date: '2026-08-29',
    target_date: '2026-09-23',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARDVg8ju6a93eIu3QomJ6310g9e-w6aEWJcUMVCUdWpRJHxEiolbrPGVqfp1afK6Ne0HXToN8DKEO9RNRTgFT_HMu7797QfV3ZHiIsfM7GutdlSzcvD4fyQ-NT4dNyFLiG-N1cIRD0RicBQ4RckizZiJStyoTUesRY6hzb_rAYil3cI4uLMxKBHDrIYjfksMZbxNGc06QtxVFQI-gTxHAclw4Qi69rUXSVe21YDS1VlZ9fNDMK7Vc',
    whatsapp_message: "¡Hola Laura Valentina! 💖 Es hora del retoque de tus acrílicas encapsuladas. ¡Asegura tu cita con Lizeth Jhoana para lucir uñas perfectas! 💅✨"
  },
  {
    id: 'r5',
    client_id: 'c4',
    client_name: 'David Gómez',
    client_gender: 'male',
    client_phone: '+57 320 111 8899',
    service_name: 'Pedicura Spa & Podología',
    cycle_days: 25,
    days_elapsed: 25,
    is_urgent: false,
    appointment_date: '2026-08-28',
    target_date: '2026-09-22',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOqaijuPp-sTcVTuF7UOyPZiGgrj6vUeppJlSCn48tBitItCf0qRzKg5iIODRYdnWoiUzXDviY2Co3p-d9_LE_uhR8vxRBIOlzpEom5VcRaWnR__BoZYJzoG0e6E8MBTigaPWqFhDqEd2whwMIjtjeDxOccex674joQqDT8dcSnj6ivKKIeMgHCViSgT28h5MyjTltZ7OkGExqy9EsyNF-7WOfpAVCEd4He1VkTs6fH-ksgZJOVJM',
    whatsapp_message: "Estimado David, te saludamos de Nails & Style Lizeth Jhoana para recordarte tu sesión mensual de pedicura spa y parafina. ¡Te esperamos! 💈🦶"
  },
  {
    id: 'r6',
    client_id: 'c5',
    client_name: 'Carlos R.',
    client_gender: 'male',
    client_phone: '+57 311 555 4321',
    service_name: 'Manicure Tradicional Caballero',
    cycle_days: 15,
    days_elapsed: 15,
    is_urgent: false,
    appointment_date: '2026-09-07',
    target_date: '2026-09-22',
    avatar_url: '',
    whatsapp_message: "¡Hola Carlos! Ya se cumplieron 15 días de tu manicure. Agenda tu turno para mantener el cuidado de cutículas en Nails & Style. ✂️✨"
  },
  {
    id: 'r7',
    client_id: 'c6',
    client_name: 'Sofía G.',
    client_gender: 'female',
    client_phone: '+57 318 765 4321',
    service_name: 'Pedicura Completa Spa',
    cycle_days: 25,
    days_elapsed: 25,
    is_urgent: true,
    appointment_date: '2026-08-28',
    target_date: '2026-09-22',
    avatar_url: '',
    whatsapp_message: "¡Hola Sofía! 🌸 Ya es momento de renovar tu pedicura completa spa. ¡Ven a relajarte y consentirte en Nails & Style Lizeth Jhoana! 💅💆‍♀️"
  },
  {
    id: 'r8',
    client_id: 'c7',
    client_name: 'Laura M.',
    client_gender: 'female',
    client_phone: '+57 301 987 6543',
    service_name: 'Retiro y Semipermanente',
    cycle_days: 25,
    days_elapsed: 25,
    is_urgent: false,
    appointment_date: '2026-08-28',
    target_date: '2026-09-22',
    avatar_url: '',
    whatsapp_message: "¡Hola Laura! ✨ Te recordamos agendar el retiro y nuevo esmaltado semipermanente para mantener tus uñas saludables y fuertes. 💅🌸"
  },
  {
    id: 'r9',
    client_id: 'c9',
    client_name: 'Andrés Felipe',
    client_gender: 'male',
    client_phone: '+57 314 333 5566',
    service_name: 'Manicure Spa Deportivo',
    cycle_days: 15,
    days_elapsed: 15,
    is_urgent: false,
    appointment_date: '2026-09-07',
    target_date: '2026-09-22',
    avatar_url: '',
    whatsapp_message: "¡Hola Andrés! Te saludamos de Nails & Style para recordarte tu turno de manicure tradicional y cuidado de manos. ¡Agenda cuando gustes! ✂️💈"
  },
  {
    id: 'r10',
    client_id: 'c10',
    client_name: 'Camila Rivas',
    client_gender: 'female',
    client_phone: '+57 316 888 9900',
    service_name: 'Baby Boomer & Queratina',
    cycle_days: 25,
    days_elapsed: 25,
    is_urgent: true,
    appointment_date: '2026-08-28',
    target_date: '2026-09-22',
    avatar_url: '',
    whatsapp_message: "¡Hola Camila! 💖 Han pasado 25 días de tu esmaltado Baby Boomer. ¡Te esperamos en Nails & Style Lizeth Jhoana para consentir tus manos! 💅✨"
  }
];

export const SPECIAL_DATE_CAMPAIGNS: SpecialDateCampaign[] = [
  {
    id: 'sp1',
    title: 'Día de la Madre',
    tag: 'Faltan 8 días',
    days_left: 8,
    subtitle: 'Campaña de agendamiento preventivo',
    banner_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcJWN_HhYzUxZTG_i8q_zMXrCU7D3ShSYXEqzfJizEuOJCK8phJ9w0RZdY3Pc2m7Ryu0XVzryiIvdKWEmnUOhdZfpxTwvyXAQc86e-69khF3wwwx5WTMzg26tecKUAud-FqZWsCW54mppWPjLVcIWkFMNR7RvJmzYxg5LMrL36FsnE8VUILES2XwgoXPVEl3UJ3KVc5f_C6woKgfXtXDhvwf8elH6Ne5OWOhsxtb3dctY-SVUsvvo',
    banner_headline: 'Consiéntela con Amor',
    banner_edition: 'Edición Especial',
    sample_message: '🌸 ¡Se acerca el Día de la Madre! Asegura tu turno con anticipación en Nails & Style Lizeth Jhoana y regálale a mamá (o regálate a ti) un día de manicura inolvidable. ¡Cupos limitados! 💖🎁',
    scheduled_date: 'Mayo 2026',
    is_active: true
  },
  {
    id: 'sp2',
    title: 'Amor y Amistad',
    tag: 'Alerta programada',
    days_left: 14,
    subtitle: 'Alerta programada para el 12 de Septiembre',
    banner_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZOnel49v_g4dq-qKzYDW5HZTPEZ5g-YpHxCv_ZdhqYeoSEgYKzYAVbbfIexkaJzBPO23-FDbGO7tH-owlRkBhFL0MPSgCwBNyoK_u4hmAxJu-ygI0phyvO9tvE6KjLzYHFA96Z0L41j1GlEzxYoNAdx1y7sSRD4-V5jVbXPH941Cxr3N7OoaUkUvf5N4PzHo-Sk-BfIim72mQXVaA9Q9_GuoQ0kkBBKZTmbJyXZuJjYRLq3H1T-c',
    banner_headline: 'Celebra la Amistad',
    banner_edition: 'Promoción Dúo',
    sample_message: '💖 ¡Llega Amor y Amistad! Ven con tu amiga, pareja o consentida a Nails & Style Lizeth Jhoana y disfruten de un combo manicure con diseño de cortesía. 🥂💅',
    scheduled_date: '12 de Septiembre',
    is_active: false
  }
];

export const TRENDS_SHOWCASE = [
  {
    title: 'Rose Gold Nude',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZOnel49v_g4dq-qKzYDW5HZTPEZ5g-YpHxCv_ZdhqYeoSEgYKzYAVbbfIexkaJzBPO23-FDbGO7tH-owlRkBhFL0MPSgCwBNyoK_u4hmAxJu-ygI0phyvO9tvE6KjLzYHFA96Z0L41j1GlEzxYoNAdx1y7sSRD4-V5jVbXPH941Cxr3N7OoaUkUvf5N4PzHo-Sk-BfIim72mQXVaA9Q9_GuoQ0kkBBKZTmbJyXZuJjYRLq3H1T-c'
  },
  {
    title: 'Glazed Pearl',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5_0LYkiZD8UORQ-5UOI-Ov2p7G76W0MEue-zt9oKav3xyzkxE5dm1h7I91SYTEtEH3Cd7MaBXLqogXEasQcZl7yx7U9zPOQGm5z8rPsivXvnyZdLZS3jZjlL65VQUTRnt1rxajiJGwbo0G6P4CYcv09PdnXDgWzvhePgFKoW0NSitXECiCHjLlwXQiPoW9TP4ue1ke7jalaTOS4vDpM-jLvGIsATFg9ufl_v_6NyMzEwIcIn944'
  }
];

/**
 * Builds custom gender-tailored WhatsApp link and text message
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateAppointmentMessage(
  clientName: string,
  gender: 'female' | 'male',
  serviceName: string,
  time: string,
  dateText: string = 'hoy'
): string {
  if (gender === 'female') {
    return `¡Hola ${clientName}! ✨ Te recordamos tu cita de ${serviceName} ${dateText} a las ${time} en Nails & Style Lizeth Jhoana. ¡Te esperamos para consentirte! 💅💖`;
  } else {
    return `¡Hola ${clientName}! ✂️ Te recordamos tu cita de ${serviceName} ${dateText} a las ${time} en Nails & Style Lizeth Jhoana. ¡Te esperamos para atenderte! 💈✨`;
  }
}
