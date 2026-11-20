/**
 * seed.js — Copy project images from src/assets to backend/uploads
 * and insert project records into the database.
 * Run: node seed.js
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('./config/db');

const ASSETS_DIR = path.join(__dirname, '..', 'frontend', 'src', 'assets');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Helper: copy file → uploads, return public URL ───────────────────────────
function copyAsset(filename) {
    const src  = path.join(ASSETS_DIR, filename);
    const dest = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(src)) { console.warn(`  ⚠️  Not found: ${filename}`); return null; }
    fs.copyFileSync(src, dest);
    return `/uploads/${filename}`;
}

// ── Project seed data ─────────────────────────────────────────────────────────
const PROJECTS = [
    {
        category:    'Automation',
        title:       'Coal Mining SCADA & Apron Feeder Automation',
        description: 'Complete SCADA and electrical control automation system designed to improve operational efficiency and reliability in coal mining apron feeders.',
        tag:         'Automation',
        images: [
            'coalmining_scada_appron_feeder.png',
            'coalmining_control_room.png',
            'coalmining_conveyor_belt.png',
            'coalmining_mv_switchgears.png',
            'coalmining_pushbutton_panel.png',
        ],
    },
    {
        category:    'Automation',
        title:       'Industrial PLC & SCADA Control Panels',
        description: 'Custom engineered low-voltage switchboards, PLC control architectures, and motor control centers for automated industrial facilities.',
        tag:         'Automation',
        images: [
            'general_plc_control_panel.png',
            'coalmining_panel_white.png',
            'coalmining_switchboard_cabinet.png',
        ],
    },
    {
        category:    'Marine',
        title:       'Vessel Web Analyzer & Marine Automation',
        description: 'Advanced vessel telemetry, diagnostics, and marine automation monitoring systems deployed for offshore cargo vessels and fleets.',
        tag:         'Marine',
        images: [
            'marine_vwa_vessel_web_analyzer.png',
        ],
    },
    {
        category:    'Marine',
        title:       'Cement Carrier Automation & Electrical Systems',
        description: 'Turnkey cargo handling automation, pneumatic unloader controls, and marine power distribution systems integrated for specialized vessels.',
        tag:         'Marine',
        images: [
            'marine_cement_carrier_vessels.png',
        ],
    },
    {
        category:    'Marine',
        title:       'Marine Electrical Maintenance & Retrofits',
        description: 'Comprehensive switchgear servicing, generator synchronization, and classification society certified marine electrical maintenance.',
        tag:         'Marine',
        images: [
            'marine_electrical_maintenance.png',
        ],
    },
    {
        category:    'Engineering',
        title:       'Industrial SCADA Monitoring & Telemetry',
        description: 'Centralized SCADA monitoring, sensor networks, and real-time telemetry systems built to rigorous industrial engineering standards.',
        tag:         'Engineering',
        images: [
            'general_cat_scada_system.png',
            'general_sms_server_scada.png',
        ],
    },
    {
        category:    'Engineering',
        title:       'Automated Pump & Fluid Transfer Systems',
        description: 'Heavy-duty automated pump stations, variable speed drives (VFD), and remote flow monitoring systems for industrial processing plants.',
        tag:         'Engineering',
        images: [
            'general_pump_system.png',
        ],
    },
    {
        category:    'Engineering',
        title:       'Compressed Air Dewpoint & Facility Monitoring',
        description: 'Precision dewpoint measurement and facility status monitoring systems ensuring air quality for pneumatic and industrial operations.',
        tag:         'Engineering',
        images: [
            'general_dewpoint_monitoring.png',
            'general_dewpoint_monitorings.png',
            'general_facility_pm_status.png',
            'general_command_counter_yamaha.png',
        ],
    },
    {
        category:    'Construction',
        title:       'Robotic Automation & Assembly Integration',
        description: 'High-precision multi-axis robotic cell integration, mounting structural erection, and automated assembly controls for manufacturing.',
        tag:         'Construction',
        images: [
            'others_robotic_arm.png',
        ],
    },
    {
        category:    'Construction',
        title:       'Solar PV Power System Installation & Erection',
        description: 'Turnkey industrial solar photovoltaic rooftop installation, mounting structure erection, and electrical grid connection.',
        tag:         'Construction',
        images: [
            'others_solar_panel_installation.png',
        ],
    },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
    console.log('\n🌱 Starting seed...\n');

    // Pastikan tabel projects dibuat terlebih dahulu jika belum ada
    await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            category VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            tag VARCHAR(100),
            images JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);
    console.log('📦 Table "projects" checked/created.\n');

    // Clear existing projects
    await pool.query('DELETE FROM projects');
    console.log('🗑️  Cleared existing projects\n');

    for (const project of PROJECTS) {
        console.log(`📁 [${project.category}] ${project.title}`);

        // Copy images & build URL array
        const urls = [];
        for (const filename of project.images) {
            const url = copyAsset(filename);
            if (url) {
                urls.push(url);
                console.log(`   ✅ ${filename}`);
            }
        }

        // Insert into DB
        await pool.query(
            `INSERT INTO projects (category, title, description, tag, images)
             VALUES ($1, $2, $3, $4, $5)`,
            [project.category, project.title, project.description, project.tag, JSON.stringify(urls)]
        );

        console.log(`   → Inserted with ${urls.length} images\n`);
    }

    console.log('✅ Seed complete!\n');
    await pool.end();
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
