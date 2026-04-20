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
  features: string[];
  specificFields: ServiceField[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'taxes-contabilidad',
    title: 'Taxes & Contabilidad',
    shortDesc: 'Gestión fiscal estratégica para individuos y pequeñas empresas.',
    longDesc: 'Ofrecemos soluciones contables completas para New Jersey. Nos especializamos en maximizar tus deducciones legales y mantener tu cumplimiento con el IRS, brindando tranquilidad financiera a familias y emprendedores.',
    icon: 'fa-solid fa-file-invoice-dollar',
    accentColor: '#C5A467',
    category: 'Finanzas',
    features: [
      'Preparación de impuestos personales (1040)',
      'Taxes para independientes (1099 / Schedule C)',
      'Enmiendas de impuestos (1040X)',
      'Aplicación y renovación de ITIN',
      'Planificación tributaria estratégica',
      'Bookkeeping (contabilidad mensual)',
      'Reportes de ingresos y gastos',
      'Asistencia con cartas del IRS'
    ],
    specificFields: [
      { name: 'entityType', label: 'Tipo de Entidad', type: 'select', required: true, options: ['Personal (Individual)', 'LLC', 'Corporación', 'Independiente (1099)'] },
      { name: 'revenue', label: 'Ingresos Anuales Estimados', type: 'select', required: true, options: ['$0 - $50k', '$50k - $200k', '$200k+'] },
      { name: 'hasItin', label: '¿Posee ITIN o necesita renovación?', type: 'select', required: true, options: ['Tengo ITIN vigente', 'Necesito uno nuevo', 'Necesito renovar'] }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll & Nómina',
    shortDesc: 'Simplifica la gestión de tu equipo con nóminas precisas.',
    longDesc: 'Ideal para pequeñas empresas y LLCs en NJ. Manejamos el cálculo de salarios, retenciones y cumplimiento para que te enfoques en crecer tu negocio sin preocupaciones administrativas.',
    icon: 'fa-solid fa-users-gear',
    accentColor: '#8B1116',
    category: 'Negocio',
    features: [
      'Procesamiento de nómina para pequeños negocios',
      'Cálculo de salarios y retenciones',
      'Preparación de formularios W-2 y 1099',
      'Reportes detallados de payroll',
      'Asesoria básica de cumplimiento laboral'
    ],
    specificFields: [
      { name: 'employeeCount', label: 'Número de Empleados', type: 'number', required: true },
      { name: 'frequency', label: 'Frecuencia de Pago', type: 'select', required: true, options: ['Semanal', 'Quincenal', 'Mensual'] },
      { name: 'companyName', label: 'Nombre Legal de la Empresa', type: 'text', required: true }
    ]
  },
  {
    id: 'medicare-seguros',
    title: 'Medicare & Seguros de Salud',
    shortDesc: 'Protección integral para tu salud y bienestar familiar.',
    longDesc: 'Somos especialistas certificados en el mercado de seguros de New Jersey y Medicare. Te ayudamos a navegar entre planes para asegurar que recibas el máximo beneficio al menor costo posible.',
    icon: 'fa-solid fa-hand-holding-medical',
    accentColor: '#C5A467',
    category: 'Salud',
    features: [
      'Asistencia experta con Medicare (Especialidad)',
      'Inscripción en GetCoveredNJ',
      'Seguro de salud (Marketplace)',
      'Seguro dental, visión y audición',
      'Seguro de accidentes y cáncer',
      'Evaluación de elegibilidad integral',
      'Asistencia con Medicaid',
      'Renovaciones y cambios de plan'
    ],
    specificFields: [
      { name: 'currentCoverage', label: 'Cobertura Actual', type: 'select', required: true, options: ['Ninguna', 'Privada', 'Plan de Empleado', 'Medicare/Medicaid'] },
      { name: 'zipCode', label: 'Código Postal en NJ', type: 'text', required: true, placeholder: 'Ej: 07001' }
    ]
  },
  {
    id: 'inmigracion',
    title: 'Servicios de Inmigración',
    shortDesc: 'Asistencia administrativa experta en trámites migratorios.',
    longDesc: 'Brindamos apoyo profesional en la preparación de paquetes para USCIS. Facilitamos procesos complejos con precisión administrativa (No somos abogados ni brindamos consejo legal).',
    icon: 'fa-solid fa-passport',
    accentColor: '#8B1116',
    category: 'Legal',
    features: [
      'Peticiones familiares (I-130)',
      'Ajuste de estatus (I-485)',
      'Permiso de trabajo (I-765)',
      'Affidavit of Support (I-864 / I-864A)',
      'Ciudadanía (N-400)',
      'Procesos consulares (NVC / DS-260)',
      'Solicitudes FOIA',
      'Preparación de paquetes para USCIS'
    ],
    specificFields: [
      { name: 'processType', label: 'Tipo de Proceso de Interés', type: 'select', required: true, options: ['Petición Familiar', 'Ajuste de Estatus', 'Ciudadanía', 'Permiso de Trabajo'] },
      { name: 'currentStatus', label: 'Estatus Actual', type: 'text', required: true, placeholder: 'Ej: Sin Procesar, En Proceso, Pendiente' },
      { name: 'hasAFile', label: '¿Tiene número de caso (A#)?', type: 'select', required: true, options: ['Sí', 'No', 'No lo sé'] }
    ]
  },
  {
    id: 'notaria',
    title: 'Notaría & Documentos',
    shortDesc: 'Validación oficial y profesional de tus documentos.',
    longDesc: 'Servicios rápidos y confiables de notarización y gestión documental. Aseguramos que tus trámites internacionales y domésticos cumplan con todos los requisitos legales.',
    icon: 'fa-solid fa-stamp',
    accentColor: '#C5A467',
    category: 'Documentos',
    features: [
      'Notarización de documentos oficiales',
      'Redacción de Poderes (Power of Attorney)',
      'Traducciones certificadas (Español ↔ Inglés)',
      'Gestión de Apostillas'
    ],
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
    longDesc: 'Te guiamos en la fundación de tu negocio en NJ. Desde la estructura ideal hasta los registros necesarios para operar legalmente y con éxito.',
    icon: 'fa-solid fa-building-columns',
    accentColor: '#8B1116',
    category: 'Negocio',
    features: [
      'Consultoría empresarial inicial',
      'Creación completa de LLC',
      'Registro oficial de negocio',
      'Obtención de número EIN',
      'Definición de estructura de negocio'
    ],
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
    longDesc: 'Posiciona tu negocio a nivel premium protegiendo tu propiedad intelectual. Nos encargamos del riguroso proceso de registro ante la USPTO.',
    icon: 'fa-solid fa-brain',
    accentColor: '#C5A467',
    category: 'Legal',
    features: [
      'Búsqueda de disponibilidad de nombre',
      'Registro ante la USPTO (United States Patent and Trademark Office)',
      'Preparación integral de solicitud',
      'Seguimiento exhaustivo del proceso',
      'Orientación para protección de marca'
    ],
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
    longDesc: 'Optimiza tu capacidad financiera con asesoría experta. Te preparamos para los grandes hitos de tu vida, como la compra de tu primer hogar.',
    icon: 'fa-solid fa-chart-line',
    accentColor: '#8B1116',
    category: 'Finanzas',
    features: [
      'Educación financiera sobre crédito',
      'Asesoría personalizada para mejorar crédito',
      'Preparación para compra de vivienda'
    ],
    specificFields: [
      { name: 'goal', label: 'Meta Principal', type: 'select', required: true, options: ['Subir Puntaje', 'Eliminar Errores', 'Comprar Casa/Carro', 'Educación General'] },
      { name: 'currentScore', label: 'Estimado Puntaje Actual', type: 'select', required: false, options: ['No sé', '< 500', '500-600', '600-700', '700+'] }
    ]
  },
  {
    id: 'bienes-raices',
    title: 'Bienes Raíces (NJ Realtor)',
    shortDesc: 'Tu guía experta para comprar o vender en New Jersey.',
    longDesc: 'Asesoría profesional con licencia en NJ. Te acompañamos en cada paso de la compra de tu vivienda, desde la elegibilidad financiera hasta el cierre.',
    icon: 'fa-solid fa-house-chimney',
    accentColor: '#C5A467',
    category: 'Propiedades',
    features: [
      'Compra de vivienda en New Jersey',
      'Asesoría para primeros compradores',
      'Evaluación de elegibilidad financiera',
      'Orientación experta en todo el proceso'
    ],
    specificFields: [
      { name: 'operationType', label: 'Interés en:', type: 'select', required: true, options: ['Comprar', 'Vender', 'Invertir'] },
      { name: 'locationPref', label: 'Condado de Preferencia en NJ', type: 'text', required: true, placeholder: 'Ej: Hudson, Bergen, Passaic' },
      { name: 'budgetRange', label: 'Rango de Presupuesto', type: 'select', required: true, options: [
        'Menos de $300,000',
        '$300,000 - $450,000',
        '$450,000 - $600,000',
        '$600,000 - $800,000',
        '$800,000 - $1,200,000',
        'Más de $1,200,000 (Luxury)'
      ] }
    ]
  },
  {
    id: 'medico-administrativo',
    title: 'Servicios Médicos Admin',
    shortDesc: 'Asistencia especializada en facturación y seguros médicos.',
    longDesc: 'Soporte certificado en Medical Billing and Coding. Revisamos tus facturas y te orientamos para que no pagues de más en tus servicios de salud.',
    icon: 'fa-solid fa-file-medical',
    accentColor: '#8B1116',
    category: 'Salud',
    features: [
      'Asistencia con facturación médica',
      'Revisión exhaustiva de facturas médicas',
      'Orientación informada en seguros médicos'
    ],
    specificFields: [
      { name: 'needType', label: 'Necesidad Principal', type: 'select', required: true, options: ['Revisión de Factura', 'Seguimiento de Reclamo', 'Codificación Médica', 'Otro'] },
      { name: 'carrierName', label: 'Nombre del Seguro Médico', type: 'text', required: false }
    ]
  },
  {
    id: 'ministro-bodas',
    title: 'Ministro de Bodas',
    shortDesc: 'Oficiante para ceremonias civiles y bodas personalizadas.',
    longDesc: 'Hacemos de tu día especial un momento inolvidable. Gestión administrativa y ceremonias civiles en el área de New Jersey con un toque personal.',
    icon: 'fa-solid fa-ring',
    accentColor: '#C5A467',
    category: 'Eventos',
    features: [
      'Oficiante de bodas civiles legales',
      'Ceremonias personalizadas a medida',
      'Gestión y firma de documentos matrimoniales'
    ],
    specificFields: [
      { name: 'weddingDate', label: 'Fecha Estimada', type: 'date', required: true },
      { name: 'location', label: 'Ciudad/Ubicación', type: 'text', required: true, placeholder: 'Ciudad en NJ' }
    ]
  },
  {
    id: 'multiservicios',
    title: 'Multiservicios Generales',
    shortDesc: 'Soporte administrativo integral para cualquier necesidad.',
    longDesc: 'Tu asistente administrativo personal. Nos encargamos de esos trámites tediosos para que tu vida sea más sencilla y organizada.',
    icon: 'fa-solid fa-ellipsis',
    accentColor: '#8B1116',
    category: 'General',
    features: [
      'Llenado de formularios gubernamentales',
      'Redacción de cartas formales (Escuela, Corte, Inmigración)',
      'Aplicaciones para beneficios públicos',
      'Asistencia administrativa general'
    ],
    specificFields: [
      { name: 'requirement', label: 'Describe brevemente qué necesitas', type: 'text', required: true }
    ]
  }
];

