module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/'], // Default local port
    },
    assert: {
      budgetFile: 'budget.json',
      assertions: {
        // Essential Antigravity Budgets
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.98 }], // Sovereign AA Requirement
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        
        // Strict Web Vitals (Zero-CLS Target)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2000 }], // 2.0s strict limit
        'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        
        // Blockers for Institutional Compliance
        'color-contrast': 'error',
        'document-title': 'error',
        'image-alt': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage', // Accessible via GitHub Actions logs
    },
  },
};
