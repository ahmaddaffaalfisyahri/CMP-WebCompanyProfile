const pool = require('../config/db');

/**
 * Controller untuk mengelola CRUD portfolio project
 */
const projectsController = {
    // GET /api/projects
    getAllProjects: async (_req, res) => {
        try {
            const result = await pool.query(
                'SELECT * FROM projects ORDER BY created_at DESC'
            );
            res.json(result.rows);
        } catch (err) {
            console.error('Error getAllProjects:', err);
            res.status(500).json({ error: 'Failed to fetch projects' });
        }
    },

    // GET /api/projects/:id
    getProjectById: async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT * FROM projects WHERE id = $1',
                [req.params.id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Error getProjectById:', err);
            res.status(500).json({ error: 'Failed to fetch project' });
        }
    },

    // POST /api/projects
    createProject: async (req, res) => {
        const { category, title, description, tag, images = [] } = req.body;

        if (!category || !title) {
            return res.status(400).json({ error: 'category and title are required' });
        }

        try {
            const result = await pool.query(
                `INSERT INTO projects (category, title, description, tag, images)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [category, title, description, tag, JSON.stringify(images)]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Error createProject:', err);
            res.status(500).json({ error: 'Failed to create project' });
        }
    },

    // PUT /api/projects/:id
    updateProject: async (req, res) => {
        const { category, title, description, tag, images } = req.body;

        try {
            const result = await pool.query(
                `UPDATE projects
                 SET category    = COALESCE($1, category),
                     title       = COALESCE($2, title),
                     description = COALESCE($3, description),
                     tag         = COALESCE($4, tag),
                     images      = COALESCE($5, images),
                     updated_at  = NOW()
                 WHERE id = $6
                 RETURNING *`,
                [
                    category,
                    title,
                    description,
                    tag,
                    images !== undefined ? JSON.stringify(images) : undefined,
                    req.params.id
                ]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Error updateProject:', err);
            res.status(500).json({ error: 'Failed to update project' });
        }
    },

    // DELETE /api/projects/:id
    deleteProject: async (req, res) => {
        try {
            const result = await pool.query(
                'DELETE FROM projects WHERE id = $1 RETURNING *',
                [req.params.id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json({ message: 'Project deleted', project: result.rows[0] });
        } catch (err) {
            console.error('Error deleteProject:', err);
            res.status(500).json({ error: 'Failed to delete project' });
        }
    }
};

module.exports = projectsController;
