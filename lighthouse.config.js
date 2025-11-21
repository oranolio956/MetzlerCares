export default {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/get-aid',
        'http://localhost:5173/donate',
        'http://localhost:5173/impact',
        'http://localhost:5173/resources/colorado'
      ],
      startServerCommand: 'npm run preview',
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }]
      },
      budgetsFile: 'lighthouse-budgets.json'
    }
  }
}
