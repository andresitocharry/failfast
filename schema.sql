-- Create Enums (Optional but good for strict typing, using text for flexibility in this MVP)

-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    status TEXT DEFAULT 'active'
);

-- Contracts Table
CREATE TABLE contracts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    type TEXT NOT NULL, -- perforacion, construccion, etc.
    status TEXT NOT NULL, -- active, completed, at-risk
    progress INTEGER DEFAULT 0,
    value TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    location TEXT NOT NULL,
    phase TEXT NOT NULL, -- inicio, ejecucion, cierre
    health INTEGER DEFAULT 100,
    risk_level TEXT NOT NULL, -- bajo, medio, alto
    project_manager_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract Team Members Junction Table
CREATE TABLE contract_team_members (
    contract_id TEXT REFERENCES contracts(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (contract_id, user_id)
);

-- Milestones Table
CREATE TABLE milestones (
    id TEXT PRIMARY KEY,
    contract_id TEXT REFERENCES contracts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phase TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL, -- completed, in-progress, pending, delayed
    value TEXT NOT NULL,
    deliverables JSONB DEFAULT '[]'::jsonb -- Storing array of strings as JSON
);

-- Documents Table
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    contract_id TEXT REFERENCES contracts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- contrato, tecnico, legal, financiero
    upload_date TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    size TEXT NOT NULL,
    status TEXT NOT NULL -- approved, pending, review
);

-- SEED DATA -----------------------------------------------

-- Users
INSERT INTO users (id, name, role, email, status) VALUES
('1', 'Ing. Carlos Mendoza', 'Project Manager', 'cmendoza@company.com', 'active'),
('2', 'Ing. María Torres', 'Jefe de Perforación', 'mtorres@company.com', 'active'),
('3', 'Ing. Roberto Silva', 'Supervisor HSE', 'rsilva@company.com', 'active'),
('4', 'Dr. Ana Ramírez', 'Geóloga Senior', 'aramirez@company.com', 'active'),
('5', 'Ing. Luis Paredes', 'Ingeniero de Lodos', 'lparedes@company.com', 'active'),
('6', 'Ing. Patricia Rojas', 'Project Manager', 'projas@company.com', 'active'),
('7', 'Ing. Fernando López', 'Jefe de Construcción', 'flopez@company.com', 'active'),
('8', 'Arq. Diego Morales', 'Supervisor de Obra', 'dmorales@company.com', 'active'),
('9', 'Ing. Javier Castillo', 'Project Manager', 'jcastillo@company.com', 'active'),
('10', 'Téc. Miguel Ángel Cruz', 'Jefe de Mantenimiento', 'mcruz@company.com', 'active'),
('11', 'Ing. Sandra Vega', 'Project Manager', 'svega@company.com', 'active'),
('12', 'Ing. Ricardo Duarte', 'Lead Instrumentation', 'rduarte@company.com', 'active');

-- Contracts
INSERT INTO contracts (id, title, client, type, status, progress, value, start_date, end_date, location, phase, health, risk_level, project_manager_id) VALUES
('CTR-2024-001', 'Perforación Pozo Exploratorio Bloque 15', 'PetroAndina S.A.', 'perforacion', 'active', 65, '$12.5M', '15 Ene 2026', '30 Jun 2026', 'Bloque 15 - Cuenca Oriente', 'ejecucion', 92, 'bajo', '1'),
('CTR-2023-087', 'Construcción Oleoducto Secundario Tramo A-B', 'Transportadora del Norte', 'construccion', 'active', 42, '$8.3M', '05 Dic 2025', '30 Abr 2026', 'Ruta Norte - 45km', 'ejecucion', 78, 'medio', '6'),
('CTR-2025-045', 'Mantenimiento Mayor Plataforma Marina PM-07', 'Offshore Drilling Corp', 'mantenimiento', 'at-risk', 38, '$5.8M', '10 Ene 2026', '15 Mar 2026', 'Plataforma PM-07 - Mar Caribe', 'ejecucion', 65, 'alto', '9'),
('CTR-2025-112', 'Upgrade Sistema Control Refinería Central', 'Refinería Nacional S.A.', 'refineria', 'active', 88, '$15.2M', '01 Sep 2025', '28 Feb 2026', 'Refinería Central - Unidad 3', 'cierre', 95, 'bajo', '11');

-- Contract Team Members
INSERT INTO contract_team_members (contract_id, user_id) VALUES
('CTR-2024-001', '1'), ('CTR-2024-001', '2'), ('CTR-2024-001', '3'), ('CTR-2024-001', '4'), ('CTR-2024-001', '5'),
('CTR-2023-087', '6'), ('CTR-2023-087', '7'), ('CTR-2023-087', '8'),
('CTR-2025-045', '9'), ('CTR-2025-045', '10'),
('CTR-2025-112', '11'), ('CTR-2025-112', '12');

-- Milestones (CTR-2024-001)
INSERT INTO milestones (id, contract_id, name, phase, due_date, status, value, deliverables) VALUES
('M1-C1', 'CTR-2024-001', 'Movilización de Equipo', 'inicio', '20 Ene 2026', 'completed', '10%', '["Equipo en sitio", "Permisos ambientales", "Plan HSE aprobado"]'),
('M2-C1', 'CTR-2024-001', 'Perforación Fase 1 (0-1500m)', 'ejecucion', '15 Feb 2026', 'completed', '25%', '["Reporte diario de perforación", "Análisis de núcleos", "Cementación completada"]'),
('M3-C1', 'CTR-2024-001', 'Perforación Fase 2 (1500-3000m)', 'ejecucion', '15 Mar 2026', 'in-progress', '30%', '["Registros geofísicos", "Pruebas de formación", "Control de presión"]'),
('M4-C1', 'CTR-2024-001', 'Completación del Pozo', 'ejecucion', '30 Abr 2026', 'pending', '25%', '["Instalación de tubería", "Cementación final", "Pruebas de producción"]'),
('M5-C1', 'CTR-2024-001', 'Desmovilización y Reporte Final', 'cierre', '30 Jun 2026', 'pending', '10%', '["Reporte técnico final", "Certificaciones", "Entrega de datos"]');

-- Milestones (CTR-2023-087)
INSERT INTO milestones (id, contract_id, name, phase, due_date, status, value, deliverables) VALUES
('M1-C2', 'CTR-2023-087', 'Movimiento de Tierras', 'inicio', '20 Dic 2025', 'completed', '15%', '["Topografía aprobada", "Permisos de paso", "Remoción de vegetación"]'),
('M2-C2', 'CTR-2023-087', 'Instalación Tubería Tramo 1', 'ejecucion', '05 Feb 2026', 'in-progress', '35%', '["20km instalados", "Pruebas hidrostáticas", "Soldaduras certificadas"]'),
('M3-C2', 'CTR-2023-087', 'Instalación Tubería Tramo 2', 'ejecucion', '10 Mar 2026', 'delayed', '35%', '["25km restantes", "Cruces especiales", "Sistema de protección catódica"]'),
('M4-C2', 'CTR-2023-087', 'Pruebas y Comisionamiento', 'cierre', '30 Abr 2026', 'pending', '15%', '["Pruebas finales", "As-built", "Certificaciones"]');

-- Milestones (CTR-2025-045)
INSERT INTO milestones (id, contract_id, name, phase, due_date, status, value, deliverables) VALUES
('M1-C3', 'CTR-2025-045', 'Inspección General y Diagnóstico', 'inicio', '20 Ene 2026', 'completed', '20%', '["Reporte de inspección", "Lista de trabajos", "Requisición de materiales"]'),
('M2-C3', 'CTR-2025-045', 'Mantenimiento Estructural', 'ejecucion', '10 Feb 2026', 'delayed', '40%', '["Reparación de corrosión", "Pintura", "Refuerzos estructurales"]'),
('M3-C3', 'CTR-2025-045', 'Overhaul Equipos Críticos', 'ejecucion', '28 Feb 2026', 'in-progress', '30%', '["Mantenimiento de grúa", "Sistema de bombeo", "Generadores"]');

-- Milestones (CTR-2025-112)
INSERT INTO milestones (id, contract_id, name, phase, due_date, status, value, deliverables) VALUES
('M1-C4', 'CTR-2025-112', 'Diseño e Ingeniería Detallada', 'inicio', '30 Sep 2025', 'completed', '25%', '["P&IDs actualizados", "Lista de instrumentos", "Lógicas de control"]'),
('M2-C4', 'CTR-2025-112', 'Procurement e Instalación', 'ejecucion', '15 Dic 2025', 'completed', '40%', '["Equipos instalados", "Cableado completado", "Integración DCS"]'),
('M3-C4', 'CTR-2025-112', 'Comisionamiento y Puesta en Marcha', 'cierre', '28 Feb 2026', 'in-progress', '35%', '["FAT/SAT completados", "Operación estable", "Entrenamiento personal"]');

-- Documents (CTR-2024-001)
INSERT INTO documents (id, contract_id, name, type, upload_date, uploaded_by, size, status) VALUES
('D1-C1', 'CTR-2024-001', 'Contrato Principal Firmado.pdf', 'contrato', '10 Ene 2026', 'Legal', '2.4 MB', 'approved'),
('D2-C1', 'CTR-2024-001', 'Plan de Perforación v2.3.pdf', 'tecnico', '12 Ene 2026', 'Ing. M. Torres', '8.7 MB', 'approved'),
('D3-C1', 'CTR-2024-001', 'Estudio de Impacto Ambiental.pdf', 'legal', '08 Ene 2026', 'HSE', '15.2 MB', 'approved'),
('D4-C1', 'CTR-2024-001', 'Reporte Diario Perforación - Mar 15.pdf', 'tecnico', '15 Mar 2026', 'Agente IA', '1.1 MB', 'pending');

-- Documents (CTR-2023-087)
INSERT INTO documents (id, contract_id, name, type, upload_date, uploaded_by, size, status) VALUES
('D5-C2', 'CTR-2023-087', 'Contrato EPC Firmado.pdf', 'contrato', '01 Dic 2025', 'Legal', '3.1 MB', 'approved'),
('D6-C2', 'CTR-2023-087', 'Planos de Construcción Rev.4.dwg', 'tecnico', '10 Dic 2025', 'Ing. F. López', '24.5 MB', 'approved');

-- Documents (CTR-2025-045)
INSERT INTO documents (id, contract_id, name, type, upload_date, uploaded_by, size, status) VALUES
('D7-C3', 'CTR-2025-045', 'Orden de Servicio OS-2026-045.pdf', 'contrato', '08 Ene 2026', 'Procurement', '1.8 MB', 'approved');

-- Documents (CTR-2025-112)
INSERT INTO documents (id, contract_id, name, type, upload_date, uploaded_by, size, status) VALUES
('D8-C4', 'CTR-2025-112', 'Contrato Llave en Mano.pdf', 'contrato', '25 Ago 2025', 'Legal', '4.2 MB', 'approved'),
('D9-C4', 'CTR-2025-112', 'Manual de Operación Sistema DCS.pdf', 'tecnico', '10 Feb 2026', 'Ing. R. Duarte', '12.8 MB', 'review');
