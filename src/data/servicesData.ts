export interface ServiceField {
  name: string;
  label: Record<string, string>;
  type: 'text' | 'select' | 'email' | 'tel' | 'number' | 'date';
  required: boolean;
  placeholder?: Record<string, string>;
  options?: Record<string, string[]>;
}

export interface ServiceDetail {
  id: string;
  title: Record<string, string>;
  shortDesc: Record<string, string>;
  longDesc: Record<string, string>;
  icon: string;
  accentColor: string;
  category: Record<string, string>;
  features: Record<string, string[]>;
  specificFields: ServiceField[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'taxes-contabilidad',
    title: { en: 'Taxes & Accounting', es: 'Taxes & Contabilidad' },
    shortDesc: { en: 'Strategic tax management for individuals and small businesses.', es: 'Gestión fiscal estratégica para individuos y pequeñas empresas.' },
    longDesc: { en: 'We offer comprehensive accounting solutions for New Jersey. We specialize in maximizing your legal deductions and maintaining your compliance with the IRS, providing financial peace of mind to families and entrepreneurs.', es: 'Ofrecemos soluciones contables completas para New Jersey. Nos especializamos en maximizar tus deducciones legales y mantener tu cumplimiento con el IRS, brindando tranquilidad financiera a familias y emprendedores.' },
    icon: 'fa-solid fa-file-invoice-dollar',
    accentColor: '#C5A467',
    category: { en: 'Finance', es: 'Finanzas' },
    features: {
      en: [
        'Personal tax preparation (1040)',
        'Taxes for independent contractors (1099 / Schedule C)',
        'Tax amendments (1040X)',
        'ITIN application and renewal',
        'Strategic tax planning',
        'Bookkeeping (monthly accounting)',
        'Income and expense reports',
        'Assistance with IRS letters'
      ],
      es: [
        'Preparación de impuestos personales (1040)',
        'Taxes para independientes (1099 / Schedule C)',
        'Enmiendas de impuestos (1040X)',
        'Aplicación y renovación de ITIN',
        'Planificación tributaria estratégica',
        'Bookkeeping (contabilidad mensual)',
        'Reportes de ingresos y gastos',
        'Asistencia con cartas del IRS'
      ]
    },
    specificFields: [
      { name: 'entityType', label: { en: 'Entity Type', es: 'Tipo de Entidad' }, type: 'select', required: true, options: { en: ['Personal (Individual)', 'LLC', 'Corporation', 'Independent (1099)'], es: ['Personal (Individual)', 'LLC', 'Corporación', 'Independiente (1099)'] } },
      { name: 'revenue', label: { en: 'Estimated Annual Revenue', es: 'Ingresos Anuales Estimados' }, type: 'select', required: true, options: { en: ['$0 - $50k', '$50k - $200k', '$200k+'], es: ['$0 - $50k', '$50k - $200k', '$200k+'] } },
      { name: 'hasItin', label: { en: 'Do you have an ITIN or need renewal?', es: '¿Posee ITIN o necesita renovación?' }, type: 'select', required: true, options: { en: ['I have a valid ITIN', 'I need a new one', 'I need to renew'], es: ['Tengo ITIN vigente', 'Necesito uno nuevo', 'Necesito renovar'] } }
    ]
  },
  {
    id: 'payroll',
    title: { en: 'Payroll Services', es: 'Payroll & Nómina' },
    shortDesc: { en: 'Simplify your team management with accurate payroll.', es: 'Simplifica la gestión de tu equipo con nóminas precisas.' },
    longDesc: { en: 'Ideal for small businesses and LLCs in NJ. We handle salary calculation, withholdings, and compliance so you can focus on growing your business without administrative worries.', es: 'Ideal para pequeñas empresas y LLCs en NJ. Manejamos el cálculo de salarios, retenciones y cumplimiento para que te enfoques en crecer tu negocio sin preocupaciones administrativas.' },
    icon: 'fa-solid fa-users-gear',
    accentColor: '#8B1116',
    category: { en: 'Business', es: 'Negocio' },
    features: {
      en: [
        'Payroll processing for small businesses',
        'Salary calculation and withholdings',
        'Preparation of W-2 and 1099 forms',
        'Detailed payroll reports',
        'Basic labor compliance consulting'
      ],
      es: [
        'Procesamiento de nómina para pequeños negocios',
        'Cálculo de salarios y retenciones',
        'Preparación de formularios W-2 y 1099',
        'Reportes detallados de payroll',
        'Asesoria básica de cumplimiento laboral'
      ]
    },
    specificFields: [
      { name: 'employeeCount', label: { en: 'Number of Employees', es: 'Número de Empleados' }, type: 'number', required: true },
      { name: 'frequency', label: { en: 'Payment Frequency', es: 'Frecuencia de Pago' }, type: 'select', required: true, options: { en: ['Weekly', 'Bi-weekly', 'Monthly'], es: ['Semanal', 'Quincenal', 'Mensual'] } },
      { name: 'companyName', label: { en: 'Legal Company Name', es: 'Nombre Legal de la Empresa' }, type: 'text', required: true }
    ]
  },
  {
    id: 'medicare-seguros',
    title: { en: 'Medicare & Health Insurance', es: 'Medicare & Seguros de Salud' },
    shortDesc: { en: 'Comprehensive protection for your health and family well-being.', es: 'Protección integral para tu salud y bienestar familiar.' },
    longDesc: { en: 'We are certified specialists in the New Jersey insurance market and Medicare. We help you navigate through plans to ensure you receive the maximum benefit at the lowest possible cost.', es: 'Somos especialistas certificados en el mercado de seguros de New Jersey y Medicare. Te ayudamos a navegar entre planes para asegurar que recibas el máximo beneficio al menor costo posible.' },
    icon: 'fa-solid fa-hand-holding-medical',
    accentColor: '#C5A467',
    category: { en: 'Health', es: 'Salud' },
    features: {
      en: [
        'Expert assistance with Medicare (Specialty)',
        'Enrollment in GetCoveredNJ',
        'Health insurance (Marketplace)',
        'Dental, vision and hearing insurance',
        'Accident and cancer insurance',
        'Comprehensive eligibility assessment',
        'Medicaid assistance',
        'Plan renewals and changes'
      ],
      es: [
        'Asistencia experta con Medicare (Especialidad)',
        'Inscripción en GetCoveredNJ',
        'Seguro de salud (Marketplace)',
        'Seguro dental, visión y audición',
        'Seguro de accidentes y cáncer',
        'Evaluación de elegibilidad integral',
        'Asistencia con Medicaid',
        'Renovaciones y cambios de plan'
      ]
    },
    specificFields: [
      { name: 'currentCoverage', label: { en: 'Current Coverage', es: 'Cobertura Actual' }, type: 'select', required: true, options: { en: ['None', 'Private', 'Employer Plan', 'Medicare/Medicaid'], es: ['Ninguna', 'Privada', 'Plan de Empleado', 'Medicare/Medicaid'] } },
      { name: 'zipCode', label: { en: 'NJ Zip Code', es: 'Código Postal en NJ' }, type: 'text', required: true, placeholder: { en: 'e.g. 07001', es: 'Ej: 07001' } }
    ]
  },
  {
    id: 'inmigracion',
    title: { en: 'Immigration Services', es: 'Servicios de Inmigración' },
    shortDesc: { en: 'Expert administrative assistance in immigration procedures.', es: 'Asistencia administrativa experta en trámites migratorios.' },
    longDesc: { en: 'We provide professional support in the preparation of packages for USCIS. We facilitate complex processes with administrative precision (We are not lawyers and do not provide legal advice).', es: 'Brindamos apoyo profesional en la preparación de paquetes para USCIS. Facilitamos procesos complejos con precisión administrativa (No somos abogados ni brindamos consejo legal).' },
    icon: 'fa-solid fa-passport',
    accentColor: '#8B1116',
    category: { en: 'Legal', es: 'Legal' },
    features: {
      en: [
        'Family petitions (I-130)',
        'Adjustment of status (I-485)',
        'Work permit (I-765)',
        'Affidavit of Support (I-864 / I-864A)',
        'Citizenship (N-400)',
        'Consular processes (NVC / DS-260)',
        'FOIA requests',
        'Preparation of packages for USCIS'
      ],
      es: [
        'Peticiones familiares (I-130)',
        'Ajuste de estatus (I-485)',
        'Permiso de trabajo (I-765)',
        'Affidavit of Support (I-864 / I-864A)',
        'Ciudadanía (N-400)',
        'Procesos consulares (NVC / DS-260)',
        'Solicitudes FOIA',
        'Preparación de paquetes para USCIS'
      ]
    },
    specificFields: [
      { name: 'processType', label: { en: 'Process Type of Interest', es: 'Tipo de Proceso de Interés' }, type: 'select', required: true, options: { en: ['Family Petition', 'Adjustment of Status', 'Citizenship', 'Work Permit'], es: ['Petición Familiar', 'Ajuste de Estatus', 'Ciudadanía', 'Permiso de Trabajo'] } },
      { name: 'currentStatus', label: { en: 'Current Status', es: 'Estatus Actual' }, type: 'text', required: true, placeholder: { en: 'e.g. Unprocessed, In Process, Pending', es: 'Ej: Sin Procesar, En Proceso, Pendiente' } },
      { name: 'hasAFile', label: { en: 'Do you have a case number (A#)?', es: '¿Tiene número de caso (A#)?' }, type: 'select', required: true, options: { en: ['Yes', 'No', "I don't know"], es: ['Sí', 'No', 'No lo sé'] } }
    ]
  },
  {
    id: 'notaria',
    title: { en: 'Notary & Documents', es: 'Notaría & Documentos' },
    shortDesc: { en: 'Official and professional validation of your documents.', es: 'Validación oficial y profesional de tus documentos.' },
    longDesc: { en: 'Fast and reliable notarization and document management services. We ensure that your international and domestic procedures meet all legal requirements.', es: 'Servicios rápidos y confiables de notarización y gestión documental. Aseguramos que tus trámites internacionales y domésticos cumplan con todos los requisitos legales.' },
    icon: 'fa-solid fa-stamp',
    accentColor: '#C5A467',
    category: { en: 'Documents', es: 'Documentos' },
    features: {
      en: [
        'Notarization of official documents',
        'Drafting of Power of Attorney',
        'Certified translations (Spanish ↔ English)',
        'Apostille management'
      ],
      es: [
        'Notarización de documentos oficiales',
        'Redacción de Poderes (Power of Attorney)',
        'Traducciones certificadas (Español ↔ Inglés)',
        'Gestión de Apostillas'
      ]
    },
    specificFields: [
      { name: 'docType', label: { en: 'Document Type', es: 'Tipo de Documento' }, type: 'text', required: true, placeholder: { en: 'e.g. Power of Attorney, Birth Certificate, Contract', es: 'Ej: Poder, Acta de Nacimiento, Contrato' } },
      { name: 'needsTranslation', label: { en: 'Needs Translation?', es: '¿Requiere Traducción?' }, type: 'select', required: true, options: { en: ['Yes', 'No'], es: ['Sí', 'No'] } },
      { name: 'urgency', label: { en: 'Urgency Level', es: 'Nivel de Urgencia' }, type: 'select', required: true, options: { en: ['Normal', 'Urgent (24-48h)'], es: ['Normal', 'Urgente (24-48h)'] } }
    ]
  },
  {
    id: 'servicios-empresariales',
    title: { en: 'LLC & Business Creation', es: 'Creación de LLC & Negocios' },
    shortDesc: { en: 'Turn your idea into a legally constituted company.', es: 'Convierte tu idea en una empresa legalmente constituida.' },
    longDesc: { en: 'We guide you in founding your business in NJ. From the ideal structure to the necessary registrations to operate legally and successfully.', es: 'Te guiamos en la fundación de tu negocio en NJ. Desde la estructura ideal hasta los registros necesarios para operar legalmente y con éxito.' },
    icon: 'fa-solid fa-building-columns',
    accentColor: '#8B1116',
    category: { en: 'Business', es: 'Negocio' },
    features: {
      en: [
        'Initial business consulting',
        'Complete LLC creation',
        'Official business registration',
        'Obtaining EIN number',
        'Definition of business structure'
      ],
      es: [
        'Consultoría empresarial inicial',
        'Creación completa de LLC',
        'Registro oficial de negocio',
        'Obtención de número EIN',
        'Definición de estructura de negocio'
      ]
    },
    specificFields: [
      { name: 'businessNature', label: { en: 'Business Industry or Nature', es: 'Giro o Industria del Negocio' }, type: 'text', required: true, placeholder: { en: 'e.g. Construction, Cleaning, Tech', es: 'Ej: Construcción, Limpieza, Tecnología' } },
      { name: 'state', label: { en: 'State of Incorporation', es: 'Estado de Constitución' }, type: 'text', required: true, placeholder: { en: 'e.g. New Jersey', es: 'Ej: New Jersey' } },
      { name: 'hasEIN', label: { en: 'Already have an EIN number?', es: '¿Ya cuenta con número EIN?' }, type: 'select', required: true, options: { en: ['Yes', 'No', 'I need to apply for it'], es: ['Sí', 'No', 'Necesito tramitarlo'] } }
    ]
  },
  {
    id: 'registro-marca',
    title: { en: 'Trademark Registration', es: 'Registro de Marca (Trademark)' },
    shortDesc: { en: 'Protect the identity and future of your brand.', es: 'Protege la identidad y el futuro de tu marca.' },
    longDesc: { en: 'Position your business at a premium level by protecting your intellectual property. We handle the rigorous registration process before the USPTO.', es: 'Posiciona tu negocio a nivel premium protegiendo tu propiedad intelectual. Nos encargamos del riguroso proceso de registro ante la USPTO.' },
    icon: 'fa-solid fa-brain',
    accentColor: '#C5A467',
    category: { en: 'Legal', es: 'Legal' },
    features: {
      en: [
        'Name availability search',
        'Registration with the USPTO (United States Patent and Trademark Office)',
        'Complete application preparation',
        'Comprehensive process monitoring',
        'Brand protection guidance'
      ],
      es: [
        'Búsqueda de disponibilidad de nombre',
        'Registro ante la USPTO (United States Patent and Trademark Office)',
        'Preparación integral de solicitud',
        'Seguimiento exhaustivo del proceso',
        'Orientación para protección de marca'
      ]
    },
    specificFields: [
      { name: 'brandName', label: { en: 'Brand Name to Register', es: 'Nombre de la Marca a Registrar' }, type: 'text', required: true },
      { name: 'class', label: { en: 'Product/Service Class', es: 'Clase de Producto/Servicio' }, type: 'text', required: false, placeholder: { en: 'e.g. Clothing, Consulting, Food', es: 'Ej: Ropa, Consultoría, Comida' } },
      { name: 'hasLogo', label: { en: 'Do you also want to register the Logo?', es: '¿Desea registrar también el Logo?' }, type: 'select', required: true, options: { en: ['Name Only', 'Name and Logo', 'Logo Only'], es: ['Solo Nombre', 'Nombre y Logo', 'Solo Logo'] } }
    ]
  },
  {
    id: 'credito-finanzas',
    title: { en: 'Credit & Finance', es: 'Crédito & Finanzas' },
    shortDesc: { en: 'Education and strategies to improve your financial profile.', es: 'Educación y estrategias para mejorar tu perfil financiero.' },
    longDesc: { en: 'Optimize your financial capacity with expert advice. We prepare you for the big milestones of your life, such as the purchase of your first home.', es: 'Optimiza tu capacidad financiera con asesoría experta. Te preparamos para los grandes hitos de tu vida, como la compra de tu primer hogar.' },
    icon: 'fa-solid fa-chart-line',
    accentColor: '#8B1116',
    category: { en: 'Finance', es: 'Finanzas' },
    features: {
      en: [
        'Financial education on credit',
        'Personalized advice to improve credit',
        'Preparation for home purchase'
      ],
      es: [
        'Educación financiera sobre crédito',
        'Asesoría personalizada para mejorar crédito',
        'Preparación para compra de vivienda'
      ]
    },
    specificFields: [
      { name: 'goal', label: { en: 'Main Goal', es: 'Meta Principal' }, type: 'select', required: true, options: { en: ['Increase Score', 'Remove Errors', 'Buy House/Car', 'General Education'], es: ['Subir Puntaje', 'Eliminar Errores', 'Comprar Casa/Carro', 'Educación General'] } },
      { name: 'currentScore', label: { en: 'Estimated Current Score', es: 'Estimado Puntaje Actual' }, type: 'select', required: false, options: { en: ["I don't know", '< 500', '500-600', '600-700', '700+'], es: ['No sé', '< 500', '500-600', '600-700', '700+'] } }
    ]
  },
  {
    id: 'bienes-raices',
    title: { en: 'Real Estate (NJ Realtor)', es: 'Bienes Raíces (NJ Realtor)' },
    shortDesc: { en: 'Your expert guide to buying or selling in New Jersey.', es: 'Tu guía experta para comprar o vender en New Jersey.' },
    longDesc: { en: 'Licensed professional advice in NJ. We accompany you in every step of the purchase of your home, from financial eligibility to closing.', es: 'Asesoría profesional con licencia en NJ. Te acompañamos en cada paso de la compra de tu vivienda, desde la elegibilidad financiera hasta el cierre.' },
    icon: 'fa-solid fa-house-chimney',
    accentColor: '#C5A467',
    category: { en: 'Properties', es: 'Propiedades' },
    features: {
      en: [
        'Home buying in New Jersey',
        'Advice for first-time buyers',
        'Financial eligibility evaluation',
        'Expert guidance throughout the process'
      ],
      es: [
        'Compra de vivienda en New Jersey',
        'Asesoría para primeros compradores',
        'Evaluación de elegibilidad financiera',
        'Orientación experta en todo el proceso'
      ]
    },
    specificFields: [
      { name: 'operationType', label: { en: 'Interested in:', es: 'Interés en:' }, type: 'select', required: true, options: { en: ['Buy', 'Sell', 'Invest'], es: ['Comprar', 'Vender', 'Invertir'] } },
      { name: 'locationPref', label: { en: 'Preferred County in NJ', es: 'Condado de Preferencia en NJ' }, type: 'text', required: true, placeholder: { en: 'e.g. Hudson, Bergen, Passaic', es: 'Ej: Hudson, Bergen, Passaic' } },
      { name: 'budgetRange', label: { en: 'Budget Range', es: 'Rango de Presupuesto' }, type: 'select', required: true, options: {
        en: [
          'Less than $300,000',
          '$300,000 - $450,000',
          '$450,000 - $600,000',
          '$600,000 - $800,000',
          '$800,000 - $1,200,000',
          'More than $1,200,000 (Luxury)'
        ],
        es: [
          'Menos de $300,000',
          '$300,000 - $450,000',
          '$450,000 - $600,000',
          '$600,000 - $800,000',
          '$800,000 - $1,200,000',
          'Más de $1,200,000 (Luxury)'
        ]
      } }
    ]
  },
  {
    id: 'medico-administrativo',
    title: { en: 'Medical Admin Services', es: 'Servicios Médicos Admin' },
    shortDesc: { en: 'Specialized assistance in medical billing and insurance.', es: 'Asistencia especializada en facturación y seguros médicos.' },
    longDesc: { en: 'Certified support in Medical Billing and Coding. We review your bills and guide you so you do not pay more than necessary for your health services.', es: 'Soporte certificado en Medical Billing and Coding. Revisamos tus facturas y te orientamos para que no pagues de más en tus servicios de salud.' },
    icon: 'fa-solid fa-file-medical',
    accentColor: '#8B1116',
    category: { en: 'Health', es: 'Salud' },
    features: {
      en: [
        'Assistance with medical billing',
        'Exhaustive review of medical bills',
        'Informed guidance on medical insurance'
      ],
      es: [
        'Asistencia con facturación médica',
        'Revisión exhaustiva de facturas médicas',
        'Orientación informada en seguros médicos'
      ]
    },
    specificFields: [
      { name: 'needType', label: { en: 'Main Need', es: 'Necesidad Principal' }, type: 'select', required: true, options: { en: ['Bill Review', 'Claim Follow-up', 'Medical Coding', 'Other'], es: ['Revisión de Factura', 'Seguimiento de Reclamo', 'Codificación Médica', 'Otro'] } },
      { name: 'carrierName', label: { en: 'Health Insurance Name', es: 'Nombre del Seguro Médico' }, type: 'text', required: false }
    ]
  },
  {
    id: 'ministro-bodas',
    title: { en: 'Wedding Minister', es: 'Ministro de Bodas' },
    shortDesc: { en: 'Officiant for civil ceremonies and personalized weddings.', es: 'Oficiante para ceremonias civiles y bodas personalizadas.' },
    longDesc: { en: 'We make your special day an unforgettable moment. Administrative management and civil ceremonies in the New Jersey area with a personal touch.', es: 'Hacemos de tu día especial un momento inolvidable. Gestión administrativa y ceremonias civiles en el área de New Jersey con un toque personal.' },
    icon: 'fa-solid fa-ring',
    accentColor: '#C5A467',
    category: { en: 'Events', es: 'Eventos' },
    features: {
      en: [
        'Legal civil wedding officiant',
        'Tailor-made personalized ceremonies',
        'Management and signing of marriage documents'
      ],
      es: [
        'Oficiante de bodas civiles legales',
        'Ceremonias personalizadas a medida',
        'Gestión y firma de documentos matrimoniales'
      ]
    },
    specificFields: [
      { name: 'weddingDate', label: { en: 'Estimated Date', es: 'Fecha Estimada' }, type: 'date', required: true },
      { name: 'location', label: { en: 'City/Location', es: 'Ciudad/Ubicación' }, type: 'text', required: true, placeholder: { en: 'City in NJ', es: 'Ciudad en NJ' } }
    ]
  },
  {
    id: 'multiservicios',
    title: { en: 'General Multi-services', es: 'Multiservicios Generales' },
    shortDesc: { en: 'Comprehensive administrative support for any need.', es: 'Soporte administrativo integral para cualquier necesidad.' },
    longDesc: { en: 'Your personal administrative assistant. We take care of those tedious procedures so that your life is simpler and more organized.', es: 'Tu asistente administrativo personal. Nos encargamos de esos trámites tediosos para que tu vida sea más sencilla y organizada.' },
    icon: 'fa-solid fa-ellipsis',
    accentColor: '#8B1116',
    category: { en: 'General', es: 'General' },
    features: {
      en: [
        'Filling out government forms',
        'Drafting formal letters (School, Court, Immigration)',
        'Applications for public benefits',
        'General administrative assistance'
      ],
      es: [
        'Llenado de formularios gubernamentales',
        'Redacción de cartas formales (Escuela, Corte, Inmigración)',
        'Aplicaciones para beneficios públicos',
        'Asistencia administrativa general'
      ]
    },
    specificFields: [
      { name: 'requirement', label: { en: 'Briefly describe what you need', es: 'Describe brevemente qué necesitas' }, type: 'text', required: true }
    ]
  }
];

