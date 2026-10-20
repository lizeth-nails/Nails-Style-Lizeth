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


export const SERVICES: ServiceItem[] = [
  {
    id: 'mani-pedi',
    name: 'Manicure y Pedicura',
    price_cop: 40000,
    price_formatted: '$40.000 COP',
    reminderDays: 15,
  },
  {
    id: 'manicure-tradicional',
    name: 'Manicure',
    price_cop: 22000,
    price_formatted: '$22.000 COP',
    reminderDays: 15,
  },
  {
    id: 'pedicura-tradicional',
    name: 'Pedicura',
    price_cop: 22000,
    price_formatted: '$22.000 COP',
    reminderDays: 15,
  },
  {
    id: 'semi-manos',
    name: 'Semipermanente Manos',
    price_cop: 45000,
    price_formatted: '$45.000 COP',
    reminderDays: 25,
  },
  {
    id: 'semi-pies',
    name: 'Semipermanente Pies',
    price_cop: 40000,
    price_formatted: '$40.000 COP',
    reminderDays: 30,
  },
  {
    id: 'press-on',
    name: 'Press On',
    price_cop: 80000,
    price_formatted: '$80.000 COP',
    reminderDays: 25,
  },
  {
    id: 'semi-recubrimiento',
    name: 'Semipermanente + Recubrimiento',
    price_cop: 65000,
    price_formatted: '$65.000 COP',
    reminderDays: 25,
  },
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
    id: 'ano-nuevo',
    title: 'Año Nuevo',
    tag: 'Especial Enero',
    days_left: 8,
    subtitle: 'Comienza el año renovada y con uñas espectaculares',
    banner_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Recibe el Año Nuevo Brillando!',
    banner_edition: 'Edición Especial Año Nuevo',
  },
  {
    id: 'jueves-santo',
    title: 'Jueves Santo',
    tag: 'Especial Semana Santa',
    days_left: 8,
    subtitle: 'Luce unas manos impecables en tus días de descanso',
    banner_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Peluquería y Spa de Uñas en Semana Santa!',
    banner_edition: 'Edición Especial Semana Santa',
  },
  {
    id: 'viernes-santo',
    title: 'Viernes Santo',
    tag: 'Especial Semana Santa',
    days_left: 8,
    subtitle: 'Cuidado y elegancia para el fin de semana santo',
    banner_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Consiéntete en Semana Santa!',
    banner_edition: 'Edición Especial Semana Santa',
  },
  {
    id: 'madre',
    title: 'Día de la Madre',
    tag: 'Especial Mayo',
    days_left: 8,
    subtitle: 'Consiente a mamá con una experiencia inolvidable',
    banner_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡El regalo perfecto para Mamá!',
    banner_edition: 'Edición Especial Día de la Madre',
  },
  {
    id: 'padre',
    title: 'Día del Padre',
    tag: 'Especial Junio',
    days_left: 8,
    subtitle: 'Cuidado y limpieza de uñas para papá',
    banner_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Manos y pies impecables para Papá!',
    banner_edition: 'Edición Especial Día del Padre',
  },
  {
    id: 'amor-amistad',
    title: 'Amor y Amistad',
    tag: 'Especial Septiembre',
    days_left: 8,
    subtitle: 'Luce espectacular para celebrar el amor y la amistad',
    banner_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Brilla en Amor y Amistad!',
    banner_edition: 'Edición Especial Amor y Amistad',
  },
  {
    id: 'velitas',
    title: 'Día de las Velitas',
    tag: 'Especial Diciembre',
    days_left: 8,
    subtitle: 'Inicia las festividades navideñas con el mejor estilo',
    banner_url: 'https://images.unsplash.com/photo-1543589077-47d51996470a?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Enciende tu luz en Noche de Velitas!',
    banner_edition: 'Edición Especial Noche de Velitas',
  },
  {
    id: 'navidad',
    title: 'Navidad',
    tag: 'Especial Diciembre',
    days_left: 8,
    subtitle: 'Tus uñas listas para la gran noche navideña',
    banner_url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
    banner_headline: '¡Diseños Navideños Exclusivos!',
    banner_edition: 'Edición Especial Navidad',
  },
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
