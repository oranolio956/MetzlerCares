import { readFileSync, statSync, readdirSync } from 'fs'
import { join, extname, relative } from 'path'
import { parse } from '@typescript-eslint/parser'
import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { TSESTree } from '@typescript-eslint/types'

export interface CodeAnalysisResult {
  filePath: string
  lines: LineAnalysis[]
  complexity: ComplexityMetrics
  dependencies: DependencyAnalysis
  securityIssues: SecurityIssue[]
  performanceIssues: PerformanceIssue[]
  maintainabilityIssues: MaintainabilityIssue[]
  documentation: CodeDocumentation
  recommendations: CodeRecommendation[]
}

export interface LineAnalysis {
  lineNumber: number
  content: string
  type: LineType
  complexity: number
  securityRisk: SecurityRiskLevel
  performanceImpact: PerformanceImpact
  maintainabilityScore: number
  documentation: string
  recommendations: string[]
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number
  cognitiveComplexity: number
  linesOfCode: number
  logicalLinesOfCode: number
  maintainabilityIndex: number
}

export interface DependencyAnalysis {
  imports: ImportAnalysis[]
  exports: ExportAnalysis[]
  circularDependencies: string[]
  unusedDependencies: string[]
  missingDependencies: string[]
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: SecurityIssueType
  description: string
  lineNumber: number
  recommendation: string
  cweId?: string
  owaspCategory?: string
}

export interface PerformanceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: PerformanceIssueType
  description: string
  lineNumber: number
  recommendation: string
  estimatedImpact: string
}

export interface MaintainabilityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: MaintainabilityIssueType
  description: string
  lineNumber: number
  recommendation: string
  refactoringComplexity: 'simple' | 'moderate' | 'complex'
}

export interface CodeDocumentation {
  purpose: string
  functionality: string
  parameters: ParameterDocumentation[]
  returnValue: string
  examples: string[]
  relatedFunctions: string[]
}

export interface CodeRecommendation {
  type: RecommendationType
  priority: 'critical' | 'high' | 'medium' | 'low'
  description: string
  implementation: string
  estimatedEffort: string
  benefits: string[]
  risks: string[]
}

export type LineType = 
  | 'import' 
  | 'export' 
  | 'function' 
  | 'class' 
  | 'variable' 
  | 'control-flow' 
  | 'error-handling' 
  | 'comment' 
  | 'empty'

export type SecurityRiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical'
export type PerformanceImpact = 'none' | 'low' | 'medium' | 'high' | 'critical'
export type SecurityIssueType = 'sql-injection' | 'xss' | 'csrf' | 'insecure-crypto' | 'hardcoded-secrets' | 'path-traversal' | 'command-injection'
export type PerformanceIssueType = 'memory-leak' | 'inefficient-algorithm' | 'unnecessary-rerender' | 'large-bundle' | 'blocking-operation'
export type MaintainabilityIssueType = 'duplicate-code' | 'long-function' | 'complex-condition' | 'poor-naming' | 'tight-coupling' | 'god-object'
export type RecommendationType = 'refactor' | 'optimize' | 'secure' | 'document' | 'test' | 'deprecate'

export interface ImportAnalysis {
  source: string
  imports: string[]
  type: 'default' | 'named' | 'namespace'
  isExternal: boolean
  isUsed: boolean
}

export interface ExportAnalysis {
  name: string
  type: 'default' | 'named' | 'namespace'
  isUsed: boolean
  dependencies: string[]
}

export interface ParameterDocumentation {
  name: string
  type: string
  description: string
  optional: boolean
  defaultValue?: string
}

export class CodeAnalysisEngine {
  private analyzedFiles: Map<string, CodeAnalysisResult> = new Map()
  private dependencyGraph: Map<string, string[]> = new Map()
  private securityPatterns: SecurityPattern[] = []
  private performancePatterns: PerformancePattern[] = []
  private maintainabilityPatterns: MaintainabilityPattern[] = []

  constructor() {
    this.initializePatterns()
  }

  async analyzeCodebase(rootPath: string): Promise<Map<string, CodeAnalysisResult>> {
    const files = this.getAllFiles(rootPath)
    const results = new Map<string, CodeAnalysisResult>()

    for (const filePath of files) {
      try {
        const result = await this.analyzeFile(filePath)
        results.set(filePath, result)
        this.analyzedFiles.set(filePath, result)
      } catch (error) {
        console.error(`Failed to analyze file ${filePath}:`, error)
      }
    }

    // Analyze dependencies across all files
    this.analyzeDependencies()

    return results
  }

  async analyzeFile(filePath: string): Promise<CodeAnalysisResult> {
    const content = readFileSync(filePath, 'utf-8')
    const ext = extname(filePath)
    
    let result: CodeAnalysisResult

    switch (ext) {
      case '.js':
      case '.ts':
      case '.svelte':
        result = await this.analyzeJavaScriptFile(filePath, content)
        break
      case '.json':
        result = await this.analyzeJsonFile(filePath, content)
        break
      case '.css':
      case '.scss':
      case '.sass':
        result = await this.analyzeCssFile(filePath, content)
        break
      case '.html':
        result = await this.analyzeHtmlFile(filePath, content)
        break
      default:
        result = await this.analyzeGenericFile(filePath, content)
    }

    return result
  }

  private async analyzeJavaScriptFile(filePath: string, content: string): Promise<CodeAnalysisResult> {
    const lines = content.split('\n')
    const lineAnalysis: LineAnalysis[] = []
    let ast: TSESTree.Program | null = null

    try {
      ast = parse(content, {
        ecmaVersion: 2020,
        sourceType: 'module',
        jsx: true,
        range: true,
        loc: true
      })
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error)
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const analysis = this.analyzeLine(line, i + 1, ast, filePath)
      lineAnalysis.push(analysis)
    }

    const complexity = this.calculateComplexity(ast, lines)
    const dependencies = this.analyzeFileDependencies(ast, filePath)
    const securityIssues = this.detectSecurityIssues(ast, content, filePath)
    const performanceIssues = this.detectPerformanceIssues(ast, content, filePath)
    const maintainabilityIssues = this.detectMaintainabilityIssues(ast, content, filePath)
    const documentation = this.generateDocumentation(ast, content, filePath)
    const recommendations = this.generateRecommendations(lineAnalysis, complexity, securityIssues)

    return {
      filePath,
      lines: lineAnalysis,
      complexity,
      dependencies,
      securityIssues,
      performanceIssues,
      maintainabilityIssues,
      documentation,
      recommendations
    }
  }

  private analyzeLine(line: string, lineNumber: number, ast: TSESTree.Program | null, filePath: string): LineAnalysis {
    const trimmed = line.trim()
    
    // Determine line type
    const type = this.determineLineType(trimmed)
    
    // Calculate complexity
    const complexity = this.calculateLineComplexity(trimmed, type)
    
    // Assess security risk
    const securityRisk = this.assessSecurityRisk(trimmed, type, filePath)
    
    // Assess performance impact
    const performanceImpact = this.assessPerformanceImpact(trimmed, type)
    
    // Calculate maintainability score
    const maintainabilityScore = this.calculateMaintainabilityScore(trimmed, type)
    
    // Generate documentation
    const documentation = this.generateLineDocumentation(trimmed, type, lineNumber)
    
    // Generate recommendations
    const recommendations = this.generateLineRecommendations(trimmed, type, complexity, securityRisk)

    return {
      lineNumber,
      content: line,
      type,
      complexity,
      securityRisk,
      performanceImpact,
      maintainabilityScore,
      documentation,
      recommendations
    }
  }

  private determineLineType(line: string): LineType {
    if (line === '') return 'empty'
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) return 'comment'
    if (line.includes('import ')) return 'import'
    if (line.includes('export ')) return 'export'
    if (line.includes('function ') || line.includes('=>') || line.match(/\w+\s*\([^)]*\)\s*{/)) return 'function'
    if (line.includes('class ') || line.includes('interface ')) return 'class'
    if (line.includes('if ') || line.includes('for ') || line.includes('while ') || line.includes('switch ')) return 'control-flow'
    if (line.includes('try ') || line.includes('catch ') || line.includes('throw ')) return 'error-handling'
    if (line.includes('const ') || line.includes('let ') || line.includes('var ')) return 'variable'
    
    return 'empty'
  }

  private calculateLineComplexity(line: string, type: LineType): number {
    let complexity = 0
    
    // Count logical operators
    complexity += (line.match(/&&|\|\||!/g) || []).length
    
    // Count conditional operators
    complexity += (line.match(/\?.*:/g) || []).length
    
    // Count loops
    complexity += (line.match(/for|while|do/g) || []).length
    
    // Count branching
    complexity += (line.match(/if|else|switch|case/g) || []).length
    
    // Count function calls
    complexity += (line.match(/\w+\(/g) || []).length
    
    // Count nested parentheses
    const openParens = (line.match(/\(/g) || []).length
    const closeParens = (line.match(/\)/g) || []).length
    complexity += Math.abs(openParens - closeParens)
    
    return complexity
  }

  private assessSecurityRisk(line: string, type: LineType, filePath: string): SecurityRiskLevel {
    const securityPatterns = [
      { pattern: /eval\(/, risk: 'critical' as SecurityRiskLevel },
      { pattern: /innerHTML\s*=/, risk: 'high' as SecurityRiskLevel },
      { pattern: /document\.write/, risk: 'high' as SecurityRiskLevel },
      { pattern: /localStorage\[.*\]/, risk: 'medium' as SecurityRiskLevel },
      { pattern: /password.*=.*['"][^'"]{0,8}['"]/, risk: 'critical' as SecurityRiskLevel },
      { pattern: /api[_-]?key.*=.*['"][^'"]+['"]/, risk: 'critical' as SecurityRiskLevel },
      { pattern: /SELECT.*FROM.*WHERE.*\+/, risk: 'critical' as SecurityRiskLevel },
      { pattern: /exec\(/, risk: 'high' as SecurityRiskLevel },
      { pattern: /spawn\(/, risk: 'high' as SecurityRiskLevel }
    ]

    for (const { pattern, risk } of securityPatterns) {
      if (pattern.test(line)) {
        return risk
      }
    }

    return 'none'
  }

  private assessPerformanceImpact(line: string, type: LineType): PerformanceImpact {
    const performancePatterns = [
      { pattern: /for.*in.*for/, impact: 'high' as PerformanceImpact },
      { pattern: /while.*while/, impact: 'high' as PerformanceImpact },
      { pattern: /setInterval.*setInterval/, impact: 'medium' as PerformanceImpact },
      { pattern: /new.*Array\(\d{4,}\)/, impact: 'high' as PerformanceImpact },
      { pattern: /document\.querySelectorAll\(.*\)/, impact: 'medium' as PerformanceImpact },
      { pattern: /JSON\.parse\(.*\)/, impact: 'low' as PerformanceImpact }
    ]

    for (const { pattern, impact } of performancePatterns) {
      if (pattern.test(line)) {
        return impact
      }
    }

    return 'none'
  }

  private calculateMaintainabilityScore(line: string, type: LineType): number {
    let score = 100
    
    // Penalize long lines
    if (line.length > 120) score -= 20
    if (line.length > 200) score -= 30
    
    // Penalize complex conditions
    if (line.includes('&&') || line.includes('||')) score -= 10
    
    // Penalize deeply nested code
    const indentation = line.match(/^(\s*)/)?.[1]?.length || 0
    if (indentation > 20) score -= 20
    
    // Penalize magic numbers
    if (line.match(/\b\d{2,}\b/) && !line.includes('const') && !line.includes('let')) score -= 15
    
    // Penalize unclear variable names
    if (line.match(/\b[a-z]{1,2}\b/) && type === 'variable') score -= 10
    
    return Math.max(0, score)
  }

  private generateLineDocumentation(line: string, type: LineType, lineNumber: number): string {
    switch (type) {
      case 'import':
        return `Imports dependencies from external modules`
      case 'export':
        return `Exports functionality for use in other modules`
      case 'function':
        return `Defines a function or method`
      case 'class':
        return `Defines a class or interface`
      case 'control-flow':
        return `Controls program execution flow`
      case 'error-handling':
        return `Handles errors and exceptions`
      case 'variable':
        return `Declares and initializes variables`
      case 'comment':
        return `Provides code documentation and explanations`
      default:
        return `Code line at position ${lineNumber}`
    }
  }

  private generateLineRecommendations(line: string, type: LineType, complexity: number, securityRisk: SecurityRiskLevel): string[] {
    const recommendations: string[] = []
    
    if (complexity > 5) {
      recommendations.push('Consider breaking down complex logic into smaller functions')
    }
    
    if (securityRisk !== 'none') {
      recommendations.push(`Address security risk: ${securityRisk} severity detected`)
    }
    
    if (line.length > 120) {
      recommendations.push('Consider breaking long line into multiple lines for better readability')
    }
    
    if (type === 'variable' && line.includes('var ')) {
      recommendations.push('Consider using const or let instead of var for better scoping')
    }
    
    return recommendations
  }

  private calculateComplexity(ast: TSESTree.Program | null, lines: string[]): ComplexityMetrics {
    let cyclomaticComplexity = 1
    let cognitiveComplexity = 0
    
    if (ast) {
      // Calculate cyclomatic complexity
      const complexityVisitor = {
        IfStatement: () => cyclomaticComplexity++,
        ConditionalExpression: () => cyclomaticComplexity++,
        LogicalExpression: () => cyclomaticComplexity++,
        SwitchCase: () => cyclomaticComplexity++,
        CatchClause: () => cyclomaticComplexity++,
        ForStatement: () => cyclomaticComplexity++,
        ForInStatement: () => cyclomaticComplexity++,
        ForOfStatement: () => cyclomaticComplexity++,
        WhileStatement: () => cyclomaticComplexity++,
        DoWhileStatement: () => cyclomaticComplexity++
      }
      
      this.traverseAST(ast, complexityVisitor)
      
      // Calculate cognitive complexity
      cognitiveComplexity = this.calculateCognitiveComplexity(ast)
    }
    
    const linesOfCode = lines.length
    const logicalLinesOfCode = lines.filter(line => line.trim() !== '' && !line.trim().startsWith('//')).length
    const maintainabilityIndex = this.calculateMaintainabilityIndex(cyclomaticComplexity, linesOfCode, logicalLinesOfCode)
    
    return {
      cyclomaticComplexity,
      cognitiveComplexity,
      linesOfCode,
      logicalLinesOfCode,
      maintainabilityIndex
    }
  }

  private calculateCognitiveComplexity(ast: TSESTree.Program): number {
    let complexity = 0
    let nestingLevel = 0
    
    const visitor = {
      enter: (node: TSESTree.Node) => {
        if (this.isNestingConstruct(node)) {
          complexity += 1 + nestingLevel
          nestingLevel++
        }
      },
      exit: (node: TSESTree.Node) => {
        if (this.isNestingConstruct(node)) {
          nestingLevel--
        }
      }
    }
    
    this.traverseASTWithNesting(ast, visitor)
    
    return complexity
  }

  private isNestingConstruct(node: TSESTree.Node): boolean {
    return [
      AST_NODE_TYPES.IfStatement,
      AST_NODE_TYPES.ForStatement,
      AST_NODE_TYPES.WhileStatement,
      AST_NODE_TYPES.DoWhileStatement,
      AST_NODE_TYPES.SwitchStatement,
      AST_NODE_TYPES.TryStatement,
      AST_NODE_TYPES.CatchClause
    ].includes(node.type as AST_NODE_TYPES)
  }

  private calculateMaintainabilityIndex(cyclomaticComplexity: number, linesOfCode: number, logicalLinesOfCode: number): number {
    const avgComplexity = cyclomaticComplexity / Math.max(1, logicalLinesOfCode)
    const complexityFactor = Math.max(0, 100 - (avgComplexity * 20))
    const lengthFactor = Math.max(0, 100 - (linesOfCode / 100))
    
    return Math.round((complexityFactor + lengthFactor) / 2)
  }

  private analyzeFileDependencies(ast: TSESTree.Program | null, filePath: string): DependencyAnalysis {
    const imports: ImportAnalysis[] = []
    const exports: ExportAnalysis[] = []
    
    if (ast) {
      const visitor = {
        ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
          imports.push({
            source: node.source.value,
            imports: node.specifiers.map(spec => {
              if (spec.type === AST_NODE_TYPES.ImportDefaultSpecifier) return 'default'
              if (spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier) return 'namespace'
              return (spec as TSESTree.ImportSpecifier).imported.name
            }),
            type: node.specifiers.some(spec => spec.type === AST_NODE_TYPES.ImportDefaultSpecifier) ? 'default' :
                  node.specifiers.some(spec => spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier) ? 'namespace' : 'named',
            isExternal: !node.source.value.startsWith('.'),
            isUsed: true // Will be verified later
          })
        },
        ExportNamedDeclaration: (node: TSESTree.ExportNamedDeclaration) => {
          if (node.source) {
            // Re-export from another module
            exports.push({
              name: node.specifiers.map(spec => (spec as TSESTree.ExportSpecifier).local.name).join(', '),
              type: 'named',
              isUsed: true,
              dependencies: [node.source.value]
            })
          }
        },
        ExportDefaultDeclaration: () => {
          exports.push({
            name: 'default',
            type: 'default',
            isUsed: true,
            dependencies: []
          })
        }
      }
      
      this.traverseAST(ast, visitor)
    }
    
    return {
      imports,
      exports,
      circularDependencies: [], // Will be populated later
      unusedDependencies: [], // Will be populated later
      missingDependencies: [] // Will be populated later
    }
  }

  private detectSecurityIssues(ast: TSESTree.Program | null, content: string, filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = []
    
    if (!ast) return issues
    
    // SQL Injection patterns
    const sqlPatterns = [
      /SELECT.*FROM.*WHERE.*\+.*['"]/g,
      /INSERT.*INTO.*VALUES.*\+.*['"]/g,
      /UPDATE.*SET.*WHERE.*\+.*['"]/g
    ]
    
    for (const pattern of sqlPatterns) {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length
          issues.push({
            severity: 'critical',
            type: 'sql-injection',
            description: 'Potential SQL injection vulnerability detected',
            lineNumber,
            recommendation: 'Use parameterized queries or prepared statements',
            cweId: 'CWE-89',
            owaspCategory: 'A03:2021 - Injection'
          })
        })
      }
    }
    
    // XSS patterns
    const xssPatterns = [
      /innerHTML\s*=/g,
      /document\.write/g,
      /outerHTML\s*=/g
    ]
    
    for (const pattern of xssPatterns) {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length
          issues.push({
            severity: 'high',
            type: 'xss',
            description: 'Potential XSS vulnerability through DOM manipulation',
            lineNumber,
            recommendation: 'Use textContent instead of innerHTML and sanitize user input',
            cweId: 'CWE-79',
            owaspCategory: 'A03:2021 - Injection'
          })
        })
      }
    }
    
    // Hardcoded secrets
    const secretPatterns = [
      /api[_-]?key.*=.*['"][^'"]{8,}['"]/gi,
      /password.*=.*['"][^'"]{6,}['"]/gi,
      /secret.*=.*['"][^'"]{8,}['"]/gi,
      /token.*=.*['"][^'"]{10,}['"]/gi
    ]
    
    for (const pattern of secretPatterns) {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length
          issues.push({
            severity: 'critical',
            type: 'hardcoded-secrets',
            description: 'Hardcoded secret detected in source code',
            lineNumber,
            recommendation: 'Move secrets to environment variables or secure configuration',
            cweId: 'CWE-798',
            owaspCategory: 'A09:2021 - Security Logging and Monitoring Failures'
          })
        })
      }
    }
    
    return issues
  }

  private detectPerformanceIssues(ast: TSESTree.Program | null, content: string, filePath: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []
    
    if (!ast) return issues
    
    // Nested loops
    const nestedLoopPattern = /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)\s*\{/g
    const nestedLoopMatches = content.match(nestedLoopPattern)
    if (nestedLoopMatches) {
      nestedLoopMatches.forEach(match => {
        const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length
        issues.push({
          severity: 'high',
          type: 'inefficient-algorithm',
          description: 'Nested loops detected - potential O(n²) complexity',
          lineNumber,
          recommendation: 'Consider using more efficient algorithms or data structures',
          estimatedImpact: 'Could cause performance issues with large datasets'
        })
      })
    }
    
    // Memory leak patterns
    const memoryLeakPatterns = [
      /setInterval\([^)]*\)(?!.*clearInterval)/g,
      /addEventListener\([^)]*\)(?!.*removeEventListener)/g,
      /setTimeout\([^)]*\)(?!.*clearTimeout)/g
    ]
    
    for (const pattern of memoryLeakPatterns) {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length
          issues.push({
            severity: 'medium',
            type: 'memory-leak',
            description: 'Potential memory leak - resource not properly cleaned up',
            lineNumber,
            recommendation: 'Ensure proper cleanup of resources in component lifecycle',
            estimatedImpact: 'Could lead to memory exhaustion over time'
          })
        })
      }
    }
    
    return issues
  }

  private detectMaintainabilityIssues(ast: TSESTree.Program | null, content: string, filePath: string): MaintainabilityIssue[] {
    const issues: MaintainabilityIssue[] = []
    
    if (!ast) return issues
    
    // Long functions
    const functionPattern = /function\s+\w+\s*\([^)]*\)\s*\{([^}]*)\}/g
    const arrowPattern = /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{([^}]*)\}/g
    
    const patterns = [functionPattern, arrowPattern]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const functionBody = match[1]
        const lineCount = functionBody.split('\n').length
        
        if (lineCount > 50) {
          const lineNumber = content.substring(0, match.index).split('\n').length
          issues.push({
            severity: 'high',
            type: 'long-function',
            description: `Function is ${lineCount} lines long - consider breaking it down`,
            lineNumber,
            recommendation: 'Break down long functions into smaller, focused functions',
            refactoringComplexity: 'moderate'
          })
        }
      }
    }
    
    // Duplicate code detection (simple version)
    const lines = content.split('\n')
    const codeBlocks = new Map<string, number[]>()
    
    for (let i = 0; i < lines.length - 5; i++) {
      const block = lines.slice(i, i + 5).join('\n').trim()
      if (block.length > 50 && !block.includes('//')) {
        if (codeBlocks.has(block)) {
          codeBlocks.get(block)!.push(i + 1)
        } else {
          codeBlocks.set(block, [i + 1])
        }
      }
    }
    
    for (const [block, lineNumbers] of codeBlocks) {
      if (lineNumbers.length > 1) {
        issues.push({
          severity: 'medium',
          type: 'duplicate-code',
          description: `Code block appears ${lineNumbers.length} times - consider extracting to a function`,
          lineNumber: lineNumbers[0],
          recommendation: 'Extract duplicate code into reusable functions or utilities',
          refactoringComplexity: 'simple'
        })
      }
    }
    
    return issues
  }

  private generateDocumentation(ast: TSESTree.Program | null, content: string, filePath: string): CodeDocumentation {
    const documentation: CodeDocumentation = {
      purpose: 'Purpose not documented',
      functionality: 'Functionality not documented',
      parameters: [],
      returnValue: 'Return value not documented',
      examples: [],
      relatedFunctions: []
    }
    
    if (!ast) return documentation
    
    // Extract JSDoc comments
    const jsdocPattern = /\/\*\*([\s\S]*?)\*\//g
    const jsdocMatches = content.match(jsdocPattern)
    
    if (jsdocMatches) {
      const jsdoc = jsdocMatches[jsdocMatches.length - 1]
      
      // Extract purpose
      const purposeMatch = jsdoc.match(/@description\s+([^\n]+)/)
      if (purposeMatch) {
        documentation.purpose = purposeMatch[1].trim()
      }
      
      // Extract parameters
      const paramMatches = jsdoc.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+([^\n]+)/g)
      if (paramMatches) {
        documentation.parameters = paramMatches.map(match => {
          const [, type, name, description] = match.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+([^\n]+)/)!
          return {
            name,
            type,
            description: description.trim(),
            optional: type.includes('?')
          }
        })
      }
      
      // Extract return value
      const returnMatch = jsdoc.match(/@returns?\s+\{([^}]+)\}\s+([^\n]+)/)
      if (returnMatch) {
        documentation.returnValue = returnMatch[2].trim()
      }
      
      // Extract examples
      const exampleMatches = jsdoc.match(/@example\s+([\s\S]*?)(?=\*\/|\@)/g)
      if (exampleMatches) {
        documentation.examples = exampleMatches.map(match => match.replace(/@example\s+/, '').trim())
      }
    }
    
    return documentation
  }

  private generateRecommendations(lineAnalysis: LineAnalysis[], complexity: ComplexityMetrics, securityIssues: SecurityIssue[]): CodeRecommendation[] {
    const recommendations: CodeRecommendation[] = []
    
    // High complexity recommendation
    if (complexity.cyclomaticComplexity > 10) {
      recommendations.push({
        type: 'refactor',
        priority: 'high',
        description: 'High cyclomatic complexity detected',
        implementation: 'Break down complex functions into smaller, testable units',
        estimatedEffort: '2-4 hours',
        benefits: ['Improved testability', 'Better maintainability', 'Reduced bug risk'],
        risks: ['Potential introduction of new bugs during refactoring']
      })
    }
    
    // Security recommendations
    if (securityIssues.length > 0) {
      const criticalIssues = securityIssues.filter(issue => issue.severity === 'critical')
      if (criticalIssues.length > 0) {
        recommendations.push({
          type: 'secure',
          priority: 'critical',
          description: `Critical security vulnerabilities detected (${criticalIssues.length})`,
          implementation: 'Address all critical security issues immediately',
          estimatedEffort: '1-8 hours per issue',
          benefits: ['Eliminates security risks', 'Compliance with security standards'],
          risks: ['If not addressed, could lead to security breaches']
        })
      }
    }
    
    // Performance recommendations
    const avgLineComplexity = lineAnalysis.reduce((sum, line) => sum + line.complexity, 0) / lineAnalysis.length
    if (avgLineComplexity > 3) {
      recommendations.push({
        type: 'optimize',
        priority: 'medium',
        description: 'High average line complexity may impact performance',
        implementation: 'Simplify complex expressions and break down nested operations',
        estimatedEffort: '1-3 hours',
        benefits: ['Improved performance', 'Better readability'],
        risks: ['Minimal risk if changes are well-tested']
      })
    }
    
    return recommendations
  }

  private async analyzeJsonFile(filePath: string, content: string): Promise<CodeAnalysisResult> {
    const lines = content.split('\n')
    const lineAnalysis: LineAnalysis[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const analysis: LineAnalysis = {
        lineNumber: i + 1,
        content: line,
        type: 'empty',
        complexity: 0,
        securityRisk: 'none',
        performanceImpact: 'none',
        maintainabilityScore: 100,
        documentation: 'JSON configuration line',
        recommendations: []
      }
      lineAnalysis.push(analysis)
    }
    
    return {
      filePath,
      lines: lineAnalysis,
      complexity: {
        cyclomaticComplexity: 0,
        cognitiveComplexity: 0,
        linesOfCode: lines.length,
        logicalLinesOfCode: lines.filter(line => line.trim() !== '').length,
        maintainabilityIndex: 100
      },
      dependencies: {
        imports: [],
        exports: [],
        circularDependencies: [],
        unusedDependencies: [],
        missingDependencies: []
      },
      securityIssues: [],
      performanceIssues: [],
      maintainabilityIssues: [],
      documentation: {
        purpose: 'JSON configuration file',
        functionality: 'Stores configuration data in JSON format',
        parameters: [],
        returnValue: 'N/A',
        examples: [],
        relatedFunctions: []
      },
      recommendations: []
    }
  }

  private async analyzeCssFile(filePath: string, content: string): Promise<CodeAnalysisResult> {
    const lines = content.split('\n')
    const lineAnalysis: LineAnalysis[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const analysis: LineAnalysis = {
        lineNumber: i + 1,
        content: line,
        type: 'empty',
        complexity: 0,
        securityRisk: 'none',
        performanceImpact: 'none',
        maintainabilityScore: 100,
        documentation: 'CSS styling rule',
        recommendations: []
      }
      lineAnalysis.push(analysis)
    }
    
    return {
      filePath,
      lines: lineAnalysis,
      complexity: {
        cyclomaticComplexity: 0,
        cognitiveComplexity: 0,
        linesOfCode: lines.length,
        logicalLinesOfCode: lines.filter(line => line.trim() !== '').length,
        maintainabilityIndex: 100
      },
      dependencies: {
        imports: [],
        exports: [],
        circularDependencies: [],
        unusedDependencies: [],
        missingDependencies: []
      },
      securityIssues: [],
      performanceIssues: [],
      maintainabilityIssues: [],
      documentation: {
        purpose: 'CSS styling file',
        functionality: 'Defines visual styles and layouts',
        parameters: [],
        returnValue: 'N/A',
        examples: [],
        relatedFunctions: []
      },
      recommendations: []
    }
  }

  private async analyzeHtmlFile(filePath: string, content: string): Promise<CodeAnalysisResult> {
    const lines = content.split('\n')
    const lineAnalysis: LineAnalysis[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const analysis: LineAnalysis = {
        lineNumber: i + 1,
        content: line,
        type: 'empty',
        complexity: 0,
        securityRisk: 'none',
        performanceImpact: 'none',
        maintainabilityScore: 100,
        documentation: 'HTML markup',
        recommendations: []
      }
      lineAnalysis.push(analysis)
    }
    
    return {
      filePath,
      lines: lineAnalysis,
      complexity: {
        cyclomaticComplexity: 0,
        cognitiveComplexity: 0,
        linesOfCode: lines.length,
        logicalLinesOfCode: lines.filter(line => line.trim() !== '').length,
        maintainabilityIndex: 100
      },
      dependencies: {
        imports: [],
        exports: [],
        circularDependencies: [],
        unusedDependencies: [],
        missingDependencies: []
      },
      securityIssues: [],
      performanceIssues: [],
      maintainabilityIssues: [],
      documentation: {
        purpose: 'HTML structure file',
        functionality: 'Defines the structure and content of web pages',
        parameters: [],
        returnValue: 'N/A',
        examples: [],
        relatedFunctions: []
      },
      recommendations: []
    }
  }

  private async analyzeGenericFile(filePath: string, content: string): Promise<CodeAnalysisResult> {
    const lines = content.split('\n')
    const lineAnalysis: LineAnalysis[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const analysis: LineAnalysis = {
        lineNumber: i + 1,
        content: line,
        type: 'empty',
        complexity: 0,
        securityRisk: 'none',
        performanceImpact: 'none',
        maintainabilityScore: 100,
        documentation: 'File content',
        recommendations: []
      }
      lineAnalysis.push(analysis)
    }
    
    return {
      filePath,
      lines: lineAnalysis,
      complexity: {
        cyclomaticComplexity: 0,
        cognitiveComplexity: 0,
        linesOfCode: lines.length,
        logicalLinesOfCode: lines.filter(line => line.trim() !== '').length,
        maintainabilityIndex: 100
      },
      dependencies: {
        imports: [],
        exports: [],
        circularDependencies: [],
        unusedDependencies: [],
        missingDependencies: []
      },
      securityIssues: [],
      performanceIssues: [],
      maintainabilityIssues: [],
      documentation: {
        purpose: 'Generic file',
        functionality: 'Contains data or configuration',
        parameters: [],
        returnValue: 'N/A',
        examples: [],
        relatedFunctions: []
      },
      recommendations: []
    }
  }

  private analyzeDependencies(): void {
    // Build dependency graph
    for (const [filePath, analysis] of this.analyzedFiles) {
      const dependencies = analysis.dependencies.imports.map(imp => imp.source)
      this.dependencyGraph.set(filePath, dependencies)
    }
    
    // Detect circular dependencies
    for (const [filePath] of this.analyzedFiles) {
      const circularDeps = this.detectCircularDependencies(filePath, new Set())
      if (circularDeps.length > 0) {
        const analysis = this.analyzedFiles.get(filePath)!
        analysis.dependencies.circularDependencies = circularDeps
      }
    }
    
    // Detect unused dependencies
    for (const [filePath, analysis] of this.analyzedFiles) {
      const unusedDeps = this.detectUnusedDependencies(filePath, analysis)
      analysis.dependencies.unusedDependencies = unusedDeps
    }
  }

  private detectCircularDependencies(filePath: string, visited: Set<string>): string[] {
    if (visited.has(filePath)) {
      return [filePath]
    }
    
    visited.add(filePath)
    const dependencies = this.dependencyGraph.get(filePath) || []
    
    for (const dep of dependencies) {
      const depPath = this.resolveDependencyPath(filePath, dep)
      if (depPath && this.analyzedFiles.has(depPath)) {
        const circular = this.detectCircularDependencies(depPath, new Set(visited))
        if (circular.length > 0) {
          return [filePath, ...circular]
        }
      }
    }
    
    return []
  }

  private detectUnusedDependencies(filePath: string, analysis: CodeAnalysisResult): string[] {
    const unused: string[] = []
    
    for (const imp of analysis.dependencies.imports) {
      if (!imp.isUsed) {
        unused.push(imp.source)
      }
    }
    
    return unused
  }

  private resolveDependencyPath(currentFile: string, dependency: string): string | null {
    // Simple resolution logic - can be enhanced
    if (dependency.startsWith('.')) {
      const currentDir = currentFile.substring(0, currentFile.lastIndexOf('/'))
      return join(currentDir, dependency)
    }
    
    return null
  }

  private getAllFiles(rootPath: string): string[] {
    const files: string[] = []
    
    const traverseDirectory = (dir: string) => {
      const entries = readdirSync(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        
        if (entry.isDirectory()) {
          // Skip node_modules and other ignored directories
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            traverseDirectory(fullPath)
          }
        } else if (entry.isFile()) {
          const ext = extname(entry.name)
          // Only analyze code files
          if (['.js', '.ts', '.svelte', '.json', '.css', '.scss', '.sass', '.html'].includes(ext)) {
            files.push(fullPath)
          }
        }
      }
    }
    
    traverseDirectory(rootPath)
    return files
  }

  private traverseAST(ast: TSESTree.Program, visitor: Record<string, Function>): void {
    const traverse = (node: TSESTree.Node) => {
      const visitorFunction = visitor[node.type]
      if (visitorFunction) {
        visitorFunction(node)
      }
      
      // Traverse child nodes
      for (const key in node) {
        const child = (node as any)[key]
        if (Array.isArray(child)) {
          child.forEach(item => {
            if (item && typeof item === 'object' && item.type) {
              traverse(item)
            }
          })
        } else if (child && typeof child === 'object' && child.type) {
          traverse(child)
        }
      }
    }
    
    traverse(ast)
  }

  private traverseASTWithNesting(ast: TSESTree.Program, visitor: { enter: Function, exit: Function }): void {
    const traverse = (node: TSESTree.Node) => {
      visitor.enter(node)
      
      // Traverse child nodes
      for (const key in node) {
        const child = (node as any)[key]
        if (Array.isArray(child)) {
          child.forEach(item => {
            if (item && typeof item === 'object' && item.type) {
              traverse(item)
            }
          })
        } else if (child && typeof child === 'object' && child.type) {
          traverse(child)
        }
      }
      
      visitor.exit(node)
    }
    
    traverse(ast)
  }

  private initializePatterns(): void {
    // Initialize security patterns
    this.securityPatterns = [
      {
        name: 'SQL Injection',
        pattern: /SELECT.*FROM.*WHERE.*\+.*['"]/,
        severity: 'critical',
        recommendation: 'Use parameterized queries'
      },
      {
        name: 'XSS Vulnerability',
        pattern: /innerHTML\s*=/,
        severity: 'high',
        recommendation: 'Use textContent and sanitize input'
      },
      {
        name: 'Hardcoded Secret',
        pattern: /api[_-]?key.*=.*['"][^'"]{8,}['"]/,
        severity: 'critical',
        recommendation: 'Move to environment variables'
      }
    ]
    
    // Initialize performance patterns
    this.performancePatterns = [
      {
        name: 'Nested Loops',
        pattern: /for.*in.*for/,
        severity: 'high',
        recommendation: 'Consider more efficient algorithms'
      },
      {
        name: 'Memory Leak',
        pattern: /setInterval(?!.*clearInterval)/,
        severity: 'medium',
        recommendation: 'Ensure proper cleanup'
      }
    ]
    
    // Initialize maintainability patterns
    this.maintainabilityPatterns = [
      {
        name: 'Long Function',
        pattern: /function.*\{[^}]{1000,}\}/,
        severity: 'high',
        recommendation: 'Break down into smaller functions'
      },
      {
        name: 'Magic Number',
        pattern: /\b\d{2,}\b(?!.*const|let)/,
        severity: 'medium',
        recommendation: 'Extract to named constants'
      }
    ]
  }

  getAnalyzedFiles(): Map<string, CodeAnalysisResult> {
    return this.analyzedFiles
  }

  getDependencyGraph(): Map<string, string[]> {
    return this.dependencyGraph
  }

  getSecuritySummary(): { total: number; critical: number; high: number; medium: number; low: number } {
    let total = 0
    let critical = 0
    let high = 0
    let medium = 0
    let low = 0
    
    for (const analysis of this.analyzedFiles.values()) {
      for (const issue of analysis.securityIssues) {
        total++
        switch (issue.severity) {
          case 'critical':
            critical++
            break
          case 'high':
            high++
            break
          case 'medium':
            medium++
            break
          case 'low':
            low++
            break
        }
      }
    }
    
    return { total, critical, high, medium, low }
  }

  getPerformanceSummary(): { total: number; critical: number; high: number; medium: number; low: number } {
    let total = 0
    let critical = 0
    let high = 0
    let medium = 0
    let low = 0
    
    for (const analysis of this.analyzedFiles.values()) {
      for (const issue of analysis.performanceIssues) {
        total++
        switch (issue.severity) {
          case 'critical':
            critical++
            break
          case 'high':
            high++
            break
          case 'medium':
            medium++
            break
          case 'low':
            low++
            break
        }
      }
    }
    
    return { total, critical, high, medium, low }
  }

  getMaintainabilitySummary(): { total: number; critical: number; high: number; medium: number; low: number } {
    let total = 0
    let critical = 0
    let high = 0
    let medium = 0
    let low = 0
    
    for (const analysis of this.analyzedFiles.values()) {
      for (const issue of analysis.maintainabilityIssues) {
        total++
        switch (issue.severity) {
          case 'critical':
            critical++
            break
          case 'high':
            high++
            break
          case 'medium':
            medium++
            break
          case 'low':
            low++
            break
        }
      }
    }
    
    return { total, critical, high, medium, low }
  }
}

interface SecurityPattern {
  name: string
  pattern: RegExp
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendation: string
}

interface PerformancePattern {
  name: string
  pattern: RegExp
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendation: string
}

interface MaintainabilityPattern {
  name: string
  pattern: RegExp
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendation: string
}