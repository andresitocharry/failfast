export interface Contract {
  id: string;
  title: string;
  client: string;
  type: "perforacion" | "construccion" | "mantenimiento" | "refineria";
  status: "active" | "completed" | "at-risk";
  progress: number;
  value: string;
  startDate: string;
  endDate: string;
  location: string;
  phase: "inicio" | "ejecucion" | "cierre";
  health: number;
  riskLevel: "bajo" | "medio" | "alto";
  projectManager: string;
  team: TeamMember[];
  milestones: Milestone[];
  documents: Document[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
}

export interface Milestone {
  id: string;
  name: string;
  phase: "inicio" | "ejecucion" | "cierre";
  dueDate: string;
  status: "completed" | "in-progress" | "pending" | "delayed";
  value: string;
  deliverables: string[];
}

export interface Document {
  id: string;
  name: string;
  type: "contrato" | "tecnico" | "legal" | "financiero";
  uploadDate: string;
  uploadedBy: string;
  size: string;
  status: "approved" | "pending" | "review";
}

export const mockContracts: Contract[] = [
  {
    id: "CTR-2024-001",
    title: "Perforación Pozo Exploratorio Bloque 15",
    client: "PetroAndina S.A.",
    type: "perforacion",
    status: "active",
    progress: 65,
    value: "$12.5M",
    startDate: "15 Ene 2026",
    endDate: "30 Jun 2026",
    location: "Bloque 15 - Cuenca Oriente",
    phase: "ejecucion",
    health: 92,
    riskLevel: "bajo",
    projectManager: "Ing. Carlos Mendoza",
    team: [
      { id: "1", name: "Ing. Carlos Mendoza", role: "Project Manager", email: "cmendoza@company.com", status: "active" },
      { id: "2", name: "Ing. María Torres", role: "Jefe de Perforación", email: "mtorres@company.com", status: "active" },
      { id: "3", name: "Ing. Roberto Silva", role: "Supervisor HSE", email: "rsilva@company.com", status: "active" },
      { id: "4", name: "Dr. Ana Ramírez", role: "Geóloga Senior", email: "aramirez@company.com", status: "active" },
      { id: "5", name: "Ing. Luis Paredes", role: "Ingeniero de Lodos", email: "lparedes@company.com", status: "active" },
    ],
    milestones: [
      {
        id: "M1",
        name: "Movilización de Equipo",
        phase: "inicio",
        dueDate: "20 Ene 2026",
        status: "completed",
        value: "10%",
        deliverables: ["Equipo en sitio", "Permisos ambientales", "Plan HSE aprobado"]
      },
      {
        id: "M2",
        name: "Perforación Fase 1 (0-1500m)",
        phase: "ejecucion",
        dueDate: "15 Feb 2026",
        status: "completed",
        value: "25%",
        deliverables: ["Reporte diario de perforación", "Análisis de núcleos", "Cementación completada"]
      },
      {
        id: "M3",
        name: "Perforación Fase 2 (1500-3000m)",
        phase: "ejecucion",
        dueDate: "15 Mar 2026",
        status: "in-progress",
        value: "30%",
        deliverables: ["Registros geofísicos", "Pruebas de formación", "Control de presión"]
      },
      {
        id: "M4",
        name: "Completación del Pozo",
        phase: "ejecucion",
        dueDate: "30 Abr 2026",
        status: "pending",
        value: "25%",
        deliverables: ["Instalación de tubería", "Cementación final", "Pruebas de producción"]
      },
      {
        id: "M5",
        name: "Desmovilización y Reporte Final",
        phase: "cierre",
        dueDate: "30 Jun 2026",
        status: "pending",
        value: "10%",
        deliverables: ["Reporte técnico final", "Certificaciones", "Entrega de datos"]
      },
    ],
    documents: [
      { id: "D1", name: "Contrato Principal Firmado.pdf", type: "contrato", uploadDate: "10 Ene 2026", uploadedBy: "Legal", size: "2.4 MB", status: "approved" },
      { id: "D2", name: "Plan de Perforación v2.3.pdf", type: "tecnico", uploadDate: "12 Ene 2026", uploadedBy: "Ing. M. Torres", size: "8.7 MB", status: "approved" },
      { id: "D3", name: "Estudio de Impacto Ambiental.pdf", type: "legal", uploadDate: "08 Ene 2026", uploadedBy: "HSE", size: "15.2 MB", status: "approved" },
      { id: "D4", name: "Reporte Diario Perforación - Mar 15.pdf", type: "tecnico", uploadDate: "15 Mar 2026", uploadedBy: "Agente IA", size: "1.1 MB", status: "pending" },
    ]
  },
  {
    id: "CTR-2023-087",
    title: "Construcción Oleoducto Secundario Tramo A-B",
    client: "Transportadora del Norte",
    type: "construccion",
    status: "active",
    progress: 42,
    value: "$8.3M",
    startDate: "05 Dic 2025",
    endDate: "30 Abr 2026",
    location: "Ruta Norte - 45km",
    phase: "ejecucion",
    health: 78,
    riskLevel: "medio",
    projectManager: "Ing. Patricia Rojas",
    team: [
      { id: "6", name: "Ing. Patricia Rojas", role: "Project Manager", email: "projas@company.com", status: "active" },
      { id: "7", name: "Ing. Fernando López", role: "Jefe de Construcción", email: "flopez@company.com", status: "active" },
      { id: "8", name: "Arq. Diego Morales", role: "Supervisor de Obra", email: "dmorales@company.com", status: "active" },
    ],
    milestones: [
      {
        id: "M1",
        name: "Movimiento de Tierras",
        phase: "inicio",
        dueDate: "20 Dic 2025",
        status: "completed",
        value: "15%",
        deliverables: ["Topografía aprobada", "Permisos de paso", "Remoción de vegetación"]
      },
      {
        id: "M2",
        name: "Instalación Tubería Tramo 1",
        phase: "ejecucion",
        dueDate: "05 Feb 2026",
        status: "in-progress",
        value: "35%",
        deliverables: ["20km instalados", "Pruebas hidrostáticas", "Soldaduras certificadas"]
      },
      {
        id: "M3",
        name: "Instalación Tubería Tramo 2",
        phase: "ejecucion",
        dueDate: "10 Mar 2026",
        status: "delayed",
        value: "35%",
        deliverables: ["25km restantes", "Cruces especiales", "Sistema de protección catódica"]
      },
      {
        id: "M4",
        name: "Pruebas y Comisionamiento",
        phase: "cierre",
        dueDate: "30 Abr 2026",
        status: "pending",
        value: "15%",
        deliverables: ["Pruebas finales", "As-built", "Certificaciones"]
      },
    ],
    documents: [
      { id: "D5", name: "Contrato EPC Firmado.pdf", type: "contrato", uploadDate: "01 Dic 2025", uploadedBy: "Legal", size: "3.1 MB", status: "approved" },
      { id: "D6", name: "Planos de Construcción Rev.4.dwg", type: "tecnico", uploadDate: "10 Dic 2025", uploadedBy: "Ing. F. López", size: "24.5 MB", status: "approved" },
    ]
  },
  {
    id: "CTR-2025-045",
    title: "Mantenimiento Mayor Plataforma Marina PM-07",
    client: "Offshore Drilling Corp",
    type: "mantenimiento",
    status: "at-risk",
    progress: 38,
    value: "$5.8M",
    startDate: "10 Ene 2026",
    endDate: "15 Mar 2026",
    location: "Plataforma PM-07 - Mar Caribe",
    phase: "ejecucion",
    health: 65,
    riskLevel: "alto",
    projectManager: "Ing. Javier Castillo",
    team: [
      { id: "9", name: "Ing. Javier Castillo", role: "Project Manager", email: "jcastillo@company.com", status: "active" },
      { id: "10", name: "Téc. Miguel Ángel Cruz", role: "Jefe de Mantenimiento", email: "mcruz@company.com", status: "active" },
    ],
    milestones: [
      {
        id: "M1",
        name: "Inspección General y Diagnóstico",
        phase: "inicio",
        dueDate: "20 Ene 2026",
        status: "completed",
        value: "20%",
        deliverables: ["Reporte de inspección", "Lista de trabajos", "Requisición de materiales"]
      },
      {
        id: "M2",
        name: "Mantenimiento Estructural",
        phase: "ejecucion",
        dueDate: "10 Feb 2026",
        status: "delayed",
        value: "40%",
        deliverables: ["Reparación de corrosión", "Pintura", "Refuerzos estructurales"]
      },
      {
        id: "M3",
        name: "Overhaul Equipos Críticos",
        phase: "ejecucion",
        dueDate: "28 Feb 2026",
        status: "in-progress",
        value: "30%",
        deliverables: ["Mantenimiento de grúa", "Sistema de bombeo", "Generadores"]
      },
    ],
    documents: [
      { id: "D7", name: "Orden de Servicio OS-2026-045.pdf", type: "contrato", uploadDate: "08 Ene 2026", uploadedBy: "Procurement", size: "1.8 MB", status: "approved" },
    ]
  },
  {
    id: "CTR-2025-112",
    title: "Upgrade Sistema Control Refinería Central",
    client: "Refinería Nacional S.A.",
    type: "refineria",
    status: "active",
    progress: 88,
    value: "$15.2M",
    startDate: "01 Sep 2025",
    endDate: "28 Feb 2026",
    location: "Refinería Central - Unidad 3",
    phase: "cierre",
    health: 95,
    riskLevel: "bajo",
    projectManager: "Ing. Sandra Vega",
    team: [
      { id: "11", name: "Ing. Sandra Vega", role: "Project Manager", email: "svega@company.com", status: "active" },
      { id: "12", name: "Ing. Ricardo Duarte", role: "Lead Instrumentation", email: "rduarte@company.com", status: "active" },
    ],
    milestones: [
      {
        id: "M1",
        name: "Diseño e Ingeniería Detallada",
        phase: "inicio",
        dueDate: "30 Sep 2025",
        status: "completed",
        value: "25%",
        deliverables: ["P&IDs actualizados", "Lista de instrumentos", "Lógicas de control"]
      },
      {
        id: "M2",
        name: "Procurement e Instalación",
        phase: "ejecucion",
        dueDate: "15 Dic 2025",
        status: "completed",
        value: "40%",
        deliverables: ["Equipos instalados", "Cableado completado", "Integración DCS"]
      },
      {
        id: "M3",
        name: "Comisionamiento y Puesta en Marcha",
        phase: "cierre",
        dueDate: "28 Feb 2026",
        status: "in-progress",
        value: "35%",
        deliverables: ["FAT/SAT completados", "Operación estable", "Entrenamiento personal"]
      },
    ],
    documents: [
      { id: "D8", name: "Contrato Llave en Mano.pdf", type: "contrato", uploadDate: "25 Ago 2025", uploadedBy: "Legal", size: "4.2 MB", status: "approved" },
      { id: "D9", name: "Manual de Operación Sistema DCS.pdf", type: "tecnico", uploadDate: "10 Feb 2026", uploadedBy: "Ing. R. Duarte", size: "12.8 MB", status: "review" },
    ]
  },
];

export const mockUsers: TeamMember[] = [
  { id: "1", name: "Ing. Carlos Mendoza", role: "Project Manager", email: "cmendoza@company.com", status: "active" },
  { id: "2", name: "Ing. María Torres", role: "Jefe de Perforación", email: "mtorres@company.com", status: "active" },
  { id: "3", name: "Ing. Roberto Silva", role: "Supervisor HSE", email: "rsilva@company.com", status: "active" },
  { id: "4", name: "Dr. Ana Ramírez", role: "Geóloga Senior", email: "aramirez@company.com", status: "active" },
  { id: "5", name: "Ing. Luis Paredes", role: "Ingeniero de Lodos", email: "lparedes@company.com", status: "active" },
  { id: "6", name: "Ing. Patricia Rojas", role: "Project Manager", email: "projas@company.com", status: "active" },
  { id: "7", name: "Ing. Fernando López", role: "Jefe de Construcción", email: "flopez@company.com", status: "active" },
  { id: "8", name: "Arq. Diego Morales", role: "Supervisor de Obra", email: "dmorales@company.com", status: "active" },
  { id: "9", name: "Ing. Javier Castillo", role: "Project Manager", email: "jcastillo@company.com", status: "active" },
  { id: "10", name: "Téc. Miguel Ángel Cruz", role: "Jefe de Mantenimiento", email: "mcruz@company.com", status: "active" },
  { id: "11", name: "Ing. Sandra Vega", role: "Project Manager", email: "svega@company.com", status: "active" },
  { id: "12", name: "Ing. Ricardo Duarte", role: "Lead Instrumentation", email: "rduarte@company.com", status: "active" },
];
