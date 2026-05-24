const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const slug = req.query.slug;
  if (!slug) {
    res.status(400).json({ error: 'Missing slug parameter' });
    return;
  }
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects', `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: `Project "${slug}" not found` });
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
