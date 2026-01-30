/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 * ║                     QANTUM NERVE CENTER - UNIFIED API GATEWAY                         ║
 * ║                    Central Gateway for All Empire Module Access                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file provides a unified API gateway that connects all 67 modules
 * from both MrMindQATool and MisteMind repositories.
 * 
 * @author Dimitar Prodromov
 * @version 28.4.0
 */

import { Router, Request, Response } from 'express';
import { 
  ALL_MODULES, 
  getModuleStats, 
  getModuleByName, 
  getModulesByCategory,
  ModuleCategory 
} from './index';
import { QAntumMagnet, MagnetModule } from './magnet';

// Initialize Magnet
const magnet = new QAntumMagnet();
let magnetReady = false;

// Auto-scan on startup
magnet.scan().then(() => {
  magnetReady = true;
  console.log('🧲 Magnet ready!');
});

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /modules
 * Returns all registered modules with their metadata
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: ALL_MODULES.length,
    modules: ALL_MODULES.map(m => ({
      name: m.name,
      category: m.category,
      status: m.status,
      loc: m.loc,
      files: m.files,
      exports: m.exports.length
    }))
  });
});

/**
 * GET /modules/stats
 * Returns aggregate statistics for all modules
 */
router.get('/stats', (_req: Request, res: Response) => {
  const stats = getModuleStats();
  res.json({
    success: true,
    stats: {
      totalModules: stats.totalModules,
      totalLOC: stats.totalLOC.toLocaleString(),
      totalFiles: stats.totalFiles,
      activeModules: stats.activeModules,
      experimentalModules: stats.experimentalModules,
      byCategory: Object.entries(stats.byCategory).map(([category, data]) => ({
        category,
        modules: data.count,
        loc: data.loc.toLocaleString()
      }))
    }
  });
});

/**
 * GET /modules/category/:category
 * Returns all modules in a specific category
 */
router.get('/category/:category', (req: Request, res: Response) => {
  const category = req.params.category as ModuleCategory;
  const modules = getModulesByCategory(category);
  
  if (modules.length === 0) {
    return res.status(404).json({
      success: false,
      error: `No modules found in category: ${category}`
    });
  }
  
  res.json({
    success: true,
    category,
    count: modules.length,
    totalLOC: modules.reduce((sum, m) => sum + m.loc, 0),
    modules: modules.map(m => ({
      name: m.name,
      status: m.status,
      loc: m.loc,
      exports: m.exports
    }))
  });
});

/**
 * GET /modules/:name
 * Returns detailed information about a specific module
 */
router.get('/:name', (req: Request, res: Response) => {
  const module = getModuleByName(req.params.name);
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: `Module not found: ${req.params.name}`
    });
  }
  
  res.json({
    success: true,
    module: {
      ...module,
      locFormatted: module.loc.toLocaleString()
    }
  });
});

/**
 * GET /modules/:name/exports
 * Returns the exports of a specific module
 */
router.get('/:name/exports', (req: Request, res: Response) => {
  const module = getModuleByName(req.params.name);
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: `Module not found: ${req.params.name}`
    });
  }
  
  res.json({
    success: true,
    module: module.name,
    exports: module.exports,
    path: module.path
  });
});

/**
 * POST /modules/:name/invoke
 * Dynamically invoke a function from a module
 * Body: { function: string, args: any[] }
 */
router.post('/:name/invoke', async (req: Request, res: Response) => {
  const module = getModuleByName(req.params.name);
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: `Module not found: ${req.params.name}`
    });
  }
  
  const { function: funcName, args = [] } = req.body;
  
  if (!funcName) {
    return res.status(400).json({
      success: false,
      error: 'Function name required in body'
    });
  }
  
  try {
    // Dynamic import of the module
    const importPath = module.path.replace('C:', '').replace(/\\/g, '/');
    const moduleImport = await import(importPath);
    
    if (typeof moduleImport[funcName] !== 'function') {
      return res.status(400).json({
        success: false,
        error: `${funcName} is not a function in module ${module.name}`
      });
    }
    
    const result = await moduleImport[funcName](...args);
    
    res.json({
      success: true,
      module: module.name,
      function: funcName,
      result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      module: module.name,
      function: funcName
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY OVERVIEW ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIES: ModuleCategory[] = [
  'core', 'security', 'ai', 'testing', 'enterprise', 
  'scientific', 'infrastructure', 'ui', 'data', 'integration'
];

router.get('/overview/categories', (_req: Request, res: Response) => {
  const overview = CATEGORIES.map(category => {
    const modules = getModulesByCategory(category);
    return {
      category,
      icon: getCategoryIcon(category),
      moduleCount: modules.length,
      totalLOC: modules.reduce((sum, m) => sum + m.loc, 0),
      activeModules: modules.filter(m => m.status === 'active').length,
      modules: modules.map(m => m.name)
    };
  });
  
  res.json({
    success: true,
    categories: overview
  });
});

function getCategoryIcon(category: ModuleCategory): string {
  const icons: Record<ModuleCategory, string> = {
    core: '⚙️',
    security: '🔐',
    ai: '🧠',
    testing: '🧪',
    enterprise: '🏢',
    scientific: '🔬',
    infrastructure: '🏗️',
    ui: '🎨',
    data: '💾',
    integration: '🔌'
  };
  return icons[category];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧲 MAGNET ENDPOINTS - DYNAMIC MODULE DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /modules/magnet/scan
 * Trigger a fresh scan of all directories
 */
router.post('/magnet/scan', async (_req: Request, res: Response) => {
  try {
    const modules = await magnet.scan();
    const stats = magnet.getStats();
    
    res.json({
      success: true,
      message: '🧲 Magnet scan complete',
      modulesFound: modules.length,
      totalLOC: stats.totalLOC,
      stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /modules/magnet/all
 * Returns ALL modules found by magnet
 */
router.get('/magnet/all', (_req: Request, res: Response) => {
  if (!magnetReady) {
    return res.status(503).json({
      success: false,
      error: 'Magnet is still scanning. Please wait.'
    });
  }
  
  const modules = magnet.getAllModules();
  const stats = magnet.getStats();
  
  res.json({
    success: true,
    count: modules.length,
    totalLOC: stats.totalLOC,
    totalFiles: stats.totalFiles,
    modules: modules.map(m => ({
      name: m.name,
      source: m.source,
      category: m.category,
      status: m.status,
      files: m.files,
      loc: m.loc
    }))
  });
});

/**
 * GET /modules/magnet/stats
 * Returns magnet statistics
 */
router.get('/magnet/stats', (_req: Request, res: Response) => {
  const stats = magnet.getStats();
  
  res.json({
    success: true,
    ready: magnetReady,
    stats: {
      ...stats,
      totalLOCFormatted: stats.totalLOC.toLocaleString()
    }
  });
});

/**
 * GET /modules/magnet/source/:source
 * Returns modules by source (MrMindQATool, MisteMind, etc)
 */
router.get('/magnet/source/:source', (req: Request, res: Response) => {
  const source = req.params.source as MagnetModule['source'];
  const modules = magnet.getBySource(source);
  
  res.json({
    success: true,
    source,
    count: modules.length,
    totalLOC: modules.reduce((sum, m) => sum + m.loc, 0),
    modules
  });
});

/**
 * GET /modules/magnet/category/:category
 * Returns modules by category
 */
router.get('/magnet/category/:category', (req: Request, res: Response) => {
  const category = req.params.category as any;
  const modules = magnet.getByCategory(category);
  
  res.json({
    success: true,
    category,
    count: modules.length,
    totalLOC: modules.reduce((sum, m) => sum + m.loc, 0),
    modules
  });
});

/**
 * GET /modules/magnet/find/:name
 * Find a specific module by name
 */
router.get('/magnet/find/:name', (req: Request, res: Response) => {
  const module = magnet.findModule(req.params.name);
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: `Module not found: ${req.params.name}`
    });
  }
  
  res.json({
    success: true,
    module
  });
});

/**
 * GET /modules/magnet/export
 * Export full magnet data as JSON
 */
router.get('/magnet/export', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=qantum-modules.json');
  res.send(magnet.toJSON());
});

export default router;
