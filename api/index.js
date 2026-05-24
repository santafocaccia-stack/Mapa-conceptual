// Auto-index: scans data/projects/ and generates INDEX.json dynamically
// No more manual INDEX.json maintenance

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const projectsDir = path.join(process.cwd(), 'data', 'projects');
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json'));
    
    const projects = [];
    
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(projectsDir, file), 'utf8'));
        const p = content.project;
        
        // Calculate aggregate progress from nodes (average, excluding milestones)
        const nodes = (content.nodes || []).filter(n => !n.id.startsWith('m') || !/^m\d+$/.test(n.id));
        const avgProgress = nodes.length > 0 
          ? Math.round(nodes.reduce((sum, n) => sum + (n.progress || 0), 0) / nodes.length)
          : p.progress || 0;
        
        projects.push({
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          status: p.status || 'active',
          progress: avgProgress || p.progress || 0,
          tags: p.tags || [],
          icon: p.icon || '📦',
          lastUpdated: p.lastUpdated || null,
        });
      } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
      }
    }
    
    // Sort: active first, then by progress descending
    projects.sort((a, b) => {
      const statusOrder = { active: 0, 'in-progress': 1, review: 2, done: 3 };
      const sa = statusOrder[a.status] ?? 99;
      const sb = statusOrder[b.status] ?? 99;
      if (sa !== sb) return sa - sb;
      return b.progress - a.progress;
    });
    
    res.status(200).json({
      version: '2.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      projects,
    });
  } catch (err) {
    console.error('Auto-index failed:', err);
    res.status(500).json({ error: 'Failed to generate index' });
  }
};
