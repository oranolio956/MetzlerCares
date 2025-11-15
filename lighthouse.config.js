module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173/'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }]
      },
      budgetsFile: 'lighthouse-budgets.json'
    }
  }
}