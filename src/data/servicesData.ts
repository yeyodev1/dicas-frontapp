export interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'email' | 'tel' | 'number' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  accentColor: string;
  category: string;
  specificFields: ServiceField[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'taxes-contabilidad',
    title: 'Taxes & Contabilidad',
    shortDesc: 'Gestión fiscal estratégica para individuos y pequeñas empresas.',
    longDesc: 'Ofrecemos soluciones contables completas, desde la preparación de impuestos personales (1040) hasta el manejo de libros mensuales para negocios (Bookkeeping). Nos especializamos en maximizar tus deducciones legales y mantener tu cumplimiento con el IRS.',
    icon: 'fa-solid fa-file-invoice-dollar',
    accentColor: '#C5A467',
    category: 'Finanzas',
    specificFields: [
      { name: 'entityType', label: 'Tipo de Entidad', type: 'select', required: true, options: ['Personal (Individual)', 'LLC', 'Corporación', 'Independiente (1099)'] },
      { name: 'revenue', label: 'Ingresos Anuales Estimados', type: 'select', required: true, options: ['$0 - $50k', '$50k - $200k', '$200k+'] },
      { name: 'hasItin', label: '¿Posee ITIN o necesita renovación?', type: 'select', required: true, options: ['Tengo ITIN vigente', 'Necesito uno nuevo', 'Necesito renovar'] }
    ]
  },
  {
    id: 'medicare-seguros',
    title: 'Medicare & Seguros de Salud',
    shortDesc: 'Protección integral para tu salud y bienestar familiar.',
    longDesc: 'Somos expertos en el mercado de seguros de New Jersey (GetCoveredNJ) y Medicare. Te ayudamos a navegar entre planes dentales, de visión, accidentes y más, asegurando que recibas el máximo beneficio al menor costo.',
    icon: 'fa-solid fa-hand-holding-medical',
    accentColor: '#8B1116',
    category: 'Salud',
    specificFields: [
      { name: 'dob', label: 'Fecha de Nacimiento', type: 'date', required: true },
      { name: 'currentCoverage', label: 'Cobertura Actual', type: 'select', required: true, options: ['Ninguna', 'Privada', 'Plan de Empleado', 'Medicare/Medicaid'] },
      { name: 'zipCode', label: 'Código Postal en NJ', type: 'text', required: true, placeholder: 'Ej: 07001' }
    ]
  },
  {
    id: 'inmigracion',
    title: 'Servicios de Inmigración',
    shortDesc: 'Asistencia administrativa experta en trámites migratorios.',
    longDesc: 'Brindamos apoyo en la preparación de paquetes para USCIS (No somos abogados). Desde peticiones familiares (I-130) hasta procesos de ciudadanía (N-400) y permisos de trabajo (I-765).',
    icon: 'fa-solid fa-passport',
    accentColor: '#C5A467',
    category: 'Leyes',
    specificFields: [
      { name: 'processType', label: 'Tipo de Proceso de Interés', type: 'select', required: true, options: ['Petición Familiar', 'Ajuste de Estatus', 'Ciudadanía', 'Permiso de Trabajo'] },
      { name: 'currentStatus', label: 'Estatus Actual', type: 'text', required: true, placeholder: 'Ej: Sin Procesar, En Proceso, Pendiente' },
      { name: 'hasAFile', label: '¿Tiene número de caso (A#)?', type: 'select', required: true, options: ['Sí', 'No', 'No lo sé'] }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll & Nómina',
    shortDesc: 'Simplifica la gestión de tu equipo con nóminas precisas.',
    longDesc: 'Ideal para pequeñas empresas y LLCs. Manejamos el cálculo de salarios, retenciones, formularios W-2/1099 y reportes trimestrales para que te enfoques en crecer tu negocio.',
    icon: 'fa-solid fa-briefcase',
    accentColor: '#8B1116',
    category: 'Negocios',
    specificFields: [
      { name: 'employeeCount', label: 'Número de Empleados', type: 'number', required: true },
      { name: 'frequency', label: 'Frecuencia de Pago', type: 'select', required: true, options: ['Semanal', 'Quincenal', 'Mensual'] },
      { name: 'companyName', label: 'Nombre Legal de la Empresa', type: 'text', required: true }
    ]
  },
  {
    id: 'notaria',
    title: 'Notaría & Traducciones',
    shortDesc: 'Validación oficial y profesional de tus documentos.',
    longDesc: 'Servicios rápidos de notarización, redacción de poderes (Power of Attorney), traducciones certificadas (Español-Inglés) y trámites de apostillas.',
    icon: 'fa-solid fa-stamp',
    accentColor: '#C5A467',
    category: 'Documentos',
    specificFields: [
      { name: 'docType', label: 'Tipo de Documento', type: 'text', required: true, placeholder: 'Ej: Poder, Acta de Nacimiento, Contrato' },
      { name: 'needsTranslation', label: '¿Requiere Traducción?', type: 'select', required: true, options: ['Sí', 'No'] },
      { name: 'urgency', label: 'Nivel de Urgencia', type: 'select', required: true, options: ['Normal', 'Urgente (24-48h)'] }
    ]
  },
  {
    id: 'servicios-empresariales',
    title: 'Creación de LLC & Negocios',
    shortDesc: 'Convierte tu idea en una empresa legalmente constituida.',
    longDesc: 'Te guiamos en todo el proceso de formación de LLC, obtención de EIN, registros estatales y consultoría inicial para estructurar tu negocio correctamente.',
    icon: 'fa-solid fa-building-columns',
    accentColor: '#8B1116',
    category: 'Negocios',
    specificFields: [
      { name: 'businessNature', label: 'Giro o Industria del Negocio', type: 'text', required: true, placeholder: 'Ej: Construcción, Limpieza, Tecnología' },
      { name: 'state', label: 'Estado de Constitución', type: 'text', required: true, placeholder: 'Ej: New Jersey' },
      { name: 'hasEIN', label: '¿Ya cuenta con número EIN?', type: 'select', required: true, options: ['Sí', 'No', 'Necesito tramitarlo'] }
    ]
  },
  {
    id: 'registro-marca',
    title: 'Registro de Marca (Trademark)',
    shortDesc: 'Protege la identidad y el futuro de tu marca.',
    longDesc: 'Búsqueda de disponibilidad en USPTO, preparación de solicitudes y seguimiento hasta la obtención del registro oficial de tu marca comercial.',
    icon: 'fa-solid fa-brain',
    accentColor: '#C5A467',
    category: 'Legal',
    specificFields: [
      { name: 'brandName', label: 'Nombre de la Marca a Registrar', type: 'text', required: true },
      { name: 'class', label: 'Clase de Producto/Servicio', type: 'text', required: false, placeholder: 'Ej: Ropa, Consultoría, Comida' },
      { name: 'hasLogo', label: '¿Desea registrar también el Logo?', type: 'select', required: true, options: ['Solo Nombre', 'Nombre y Logo', 'Solo Logo'] }
    ]
  },
  {
    id: 'credito-finanzas',
    title: 'Crédito & Finanzas',
    shortDesc: 'Educación y estrategias para mejorar tu perfil financiero.',
    longDesc: 'Asesoría personalizada para entender tu reporte de crédito, estrategias para mejorar tu puntaje y preparación para grandes compras como tu primera vivienda.',
    icon: 'fa-solid fa-chart-line',
    accentColor: '#8B1116',
    category: 'Finanzas',
    specificFields: [
      { name: 'goal', label: 'Meta Principal', type: 'select', required: true, options: ['Subir Puntaje', 'Eliminar Errores', 'Comprar Casa/Carro', 'Educación General'] },
      { name: 'currentScore', label: 'Estimado Puntaje Actual', type: 'select', required: false, options: ['No sé', '< 500', '500-600', '600-700', '700+'] }
    ]
  },
  {
    id: 'bienes-raices',
    title: 'Bienes Raíces (NJ Realtor)',
    shortDesc: 'Tu guía experta para comprar o vender en New Jersey.',
    longDesc: 'Como Realtor licenciada, te acompaño en cada paso: evaluación financiera, búsqueda de viviendas, negociación y cierre exitoso de tu propiedad.',
    icon: 'fa-solid fa-house-chimney',
    accentColor: '#C5A467',
    category: 'Propiedades',
    specificFields: [
      { name: 'operationType', label: 'Interés en:', type: 'select', required: true, options: ['Comprar', 'Vender', 'Invertir'] },
      { name: 'locationPref', label: 'Condado de Preferencia en NJ', type: 'text', required: true, placeholder: 'Ej: Hudson, Bergen, Passaic' },
      { name: 'budgetRange', label: 'Rango de Presupuesto', type: 'select', required: true, options: ['$200k - $400k', '$400k - $600k', '$600k+'] }
    ]
  },
  {
    id: 'medico-administrativo',
    title: 'Servicios Médicos Admin',
    shortDesc: 'Asistencia especializada en facturación y seguros médicos.',
    longDesc: 'Revisión de facturas médicas, orientación en seguros complejos y soporte administrativo certificado en Medical Billing and Coding.',
    icon: 'fa-solid fa-file-medical',
    accentColor: '#8B1116',
    category: 'Salud',
    specificFields: [
      { name: 'needType', label: 'Necesidad Principal', type: 'select', required: true, options: ['Revisión de Factura', 'Seguimiento de Reclamo', 'Codificación Médica', 'Otro'] },
      { name: 'carrierName', label: 'Nombre del Seguro Médico', type: 'text', required: false }
    ]
  },
  {
    id: 'ministro-bodas',
    title: 'Ministro de Bodas',
    shortDesc: 'Oficiante para ceremonias civiles y bodas personalizadas.',
    longDesc: 'Gestión de documentos matrimoniales, firma de actas y realización de ceremonias civiles memorables en el área de New Jersey.',
    icon: 'fa-solid fa-ring',
    accentColor: '#C5A467',
    category: 'Eventos',
    specificFields: [
      { name: 'weddingDate', label: 'Fecha Estimada', type: 'date', required: true },
      { name: 'location', label: 'Ciudad/Ubicación', type: 'text', required: true, placeholder: 'Ciudad en NJ' }
    ]
  },
  {
    id: 'multiservicios',
    title: 'Multiservicios Generales',
    shortDesc: 'Soporte administrativo integral para cualquier necesidad.',
    longDesc: 'Desde el llenado de aplicaciones gubernamentales hasta la redacción de cartas formales. Estamos aquí para facilitarte cualquier trámite administrativo.',
    icon: 'fa-solid fa-ellipsis',
    accentColor: '#8B1116',
    category: 'General',
    specificFields: [
      { name: 'requirement', label: 'Describe brevemente qué necesitas', type: 'text', required: true }
    ]
  }
];
