// Automated content generation worker for Colorado recovery services
import { seoGenerator } from './colorado-seo-generator';
import { keywordResearcher } from './colorado-keyword-research';
import { seoAnalytics } from './colorado-seo-analytics';
import { COLORADO_LOCATIONS, getPriorityLocations } from './colorado-seo-data';

export interface ContentGenerationTask {
  id: string;
  type: 'city_page' | 'keyword_research' | 'content_brief' | 'analytics_report';
  location?: string;
  templateType?: string;
  keywords?: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export class ColoradoSEOWorker {
  private tasks: ContentGenerationTask[] = [];
  private isRunning: boolean = false;
  private taskQueue: ContentGenerationTask[] = [];
  private completedTasks: ContentGenerationTask[] = [];
  
  constructor() {
    this.initializeWorker();
  }
  
  // Initialize the worker and start processing
  private initializeWorker(): void {
    this.isRunning = true;
    this.startTaskProcessor();
    console.log('Colorado SEO Worker initialized');
  }
  
  // Start processing tasks
  private startTaskProcessor(): void {
    setInterval(async () => {
      if (this.taskQueue.length > 0 && this.isRunning) {
        const task = this.taskQueue.shift();
        if (task) {
          await this.processTask(task);
        }
      }
    }, 5000); // Process tasks every 5 seconds
  }
  
  // Add task to queue
  addTask(task: Omit<ContentGenerationTask, 'id' | 'createdAt' | 'status'>): string {
    const newTask: ContentGenerationTask = {
      ...task,
      id: this.generateTaskId(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Add to queue based on priority
    if (task.priority === 'high') {
      this.taskQueue.unshift(newTask);
    } else {
      this.taskQueue.push(newTask);
    }
    
    this.tasks.push(newTask);
    console.log(`Task added: ${newTask.type} - ${newTask.location || 'General'}`);
    
    return newTask.id;
  }
  
  // Process individual task
  private async processTask(task: ContentGenerationTask): Promise<void> {
    task.status = 'in_progress';
    console.log(`Processing task: ${task.type} - ${task.location || 'General'}`);
    
    try {
      let result: any;
      
      switch (task.type) {
        case 'city_page':
          result = await this.generateCityPage(task);
          break;
        case 'keyword_research':
          result = await this.performKeywordResearch(task);
          break;
        case 'content_brief':
          result = await this.generateContentBrief(task);
          break;
        case 'analytics_report':
          result = await this.generateAnalyticsReport(task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
      
      task.result = result;
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      
      console.log(`Task completed: ${task.type} - ${task.location || 'General'}`);
      this.completedTasks.push(task);
      
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Task failed: ${task.type} - ${task.location || 'General'}`, error);
    }
  }
  
  // Generate city-specific page content
  private async generateCityPage(task: ContentGenerationTask): Promise<any> {
    const { location, templateType = 'city_sober_living' } = task;
    
    if (!location) {
      throw new Error('Location required for city page generation');
    }
    
    // Find location data
    const locationData = COLORADO_LOCATIONS.find(loc => 
      loc.city.toLowerCase().replace(/\s+/g, '-') === location.toLowerCase()
    );
    
    if (!locationData) {
      throw new Error(`Location not found: ${location}`);
    }
    
    // Generate content using SEO generator
    const content = seoGenerator.generateCityContent(locationData, templateType);
    
    // Perform keyword research for this location
    const keywords = await keywordResearcher.analyzeSERP(`${location} sober living`, locationData.city);
    
    // Generate content brief
    const contentBrief = await keywordResearcher.generateContentBrief(
      `${locationData.city} sober living`, 
      keywords
    );
    
    return {
      location: locationData,
      content,
      keywords,
      contentBrief,
      generatedAt: new Date().toISOString()
    };
  }
  
  // Perform keyword research
  private async performKeywordResearch(task: ContentGenerationTask): Promise<any> {
    const { keywords = [] } = task;
    
    // Generate comprehensive keyword report
    const keywordReport = await keywordResearcher.generateKeywordReport();
    
    // Analyze specific keywords if provided
    let specificAnalysis = {};
    if (keywords.length > 0) {
      for (const keyword of keywords) {
        specificAnalysis[keyword] = await keywordResearcher.analyzeSERP(keyword);
      }
    }
    
    return {
      keywordReport,
      specificAnalysis,
      location: task.location,
      generatedAt: new Date().toISOString()
    };
  }
  
  // Generate content brief
  private async generateContentBrief(task: ContentGenerationTask): Promise<any> {
    const { keywords = [], location } = task;
    
    if (keywords.length === 0) {
      throw new Error('Keywords required for content brief generation');
    }
    
    const briefs = [];
    
    for (const keyword of keywords) {
      // Analyze SERP for this keyword
      const serpAnalysis = await keywordResearcher.analyzeSERP(keyword, location);
      
      // Generate content brief
      const contentBrief = await keywordResearcher.generateContentBrief(keyword, serpAnalysis);
      
      briefs.push({
        keyword,
        serpAnalysis,
        contentBrief
      });
    }
    
    return {
      briefs,
      location,
      generatedAt: new Date().toISOString()
    };
  }
  
  // Generate analytics report
  private async generateAnalyticsReport(task: ContentGenerationTask): Promise<any> {
    // Generate comprehensive SEO report
    const seoReport = await seoAnalytics.generateSEOReport();
    
    // Generate monthly report
    const monthlyReport = await seoAnalytics.generateMonthlyReport();
    
    // Track competitor changes
    const competitorChanges = await seoAnalytics.trackCompetitorChanges();
    
    return {
      seoReport,
      monthlyReport,
      competitorChanges,
      generatedAt: new Date().toISOString()
    };
  }
  
  // Generate task ID
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Get task status
  getTaskStatus(taskId: string): ContentGenerationTask | undefined {
    return this.tasks.find(task => task.id === taskId);
  }
  
  // Get all tasks
  getAllTasks(): ContentGenerationTask[] {
    return [...this.tasks];
  }
  
  // Get completed tasks
  getCompletedTasks(): ContentGenerationTask[] {
    return [...this.completedTasks];
  }
  
  // Get queue status
  getQueueStatus(): {
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    queueLength: number;
  } {
    const status = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      failed: 0,
      queueLength: this.taskQueue.length
    };
    
    this.tasks.forEach(task => {
      status[task.status]++;
    });
    
    return status;
  }
  
  // Generate initial content tasks for Colorado cities
  generateInitialContentTasks(): string[] {
    const taskIds: string[] = [];
    
    // High priority cities first
    const highPriorityCities = getPriorityLocations('high');
    const mediumPriorityCities = getPriorityLocations('medium');
    
    // Generate city pages for high priority cities
    highPriorityCities.forEach(city => {
      const taskId = this.addTask({
        type: 'city_page',
        location: city.city.toLowerCase().replace(/\s+/g, '-'),
        templateType: 'city_sober_living',
        priority: 'high'
      });
      taskIds.push(taskId);
    });
    
    // Generate city pages for medium priority cities
    mediumPriorityCities.forEach(city => {
      const taskId = this.addTask({
        type: 'city_page',
        location: city.city.toLowerCase().replace(/\s+/g, '-'),
        templateType: 'city_sober_living',
        priority: 'medium'
      });
      taskIds.push(taskId);
    });
    
    // Generate keyword research task
    const keywordTaskId = this.addTask({
      type: 'keyword_research',
      priority: 'high'
    });
    taskIds.push(keywordTaskId);
    
    // Generate analytics report task
    const analyticsTaskId = this.addTask({
      type: 'analytics_report',
      priority: 'medium'
    });
    taskIds.push(analyticsTaskId);
    
    return taskIds;
  }
  
  // Stop the worker
  stop(): void {
    this.isRunning = false;
    console.log('Colorado SEO Worker stopped');
  }
  
  // Resume the worker
  resume(): void {
    this.isRunning = true;
    console.log('Colorado SEO Worker resumed');
  }
  
  // Get worker statistics
  getStatistics(): {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    successRate: number;
    avgProcessingTime: number;
    activeSince: string;
    isRunning: boolean;
  } {
    const completed = this.completedTasks.length;
    const failed = this.tasks.filter(t => t.status === 'failed').length;
    const total = this.tasks.length;
    
    // Calculate average processing time
    const processingTimes = this.completedTasks
      .filter(task => task.completedAt && task.createdAt)
      .map(task => 
        new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime()
      );
    
    const avgProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
      : 0;
    
    return {
      totalTasks: total,
      completedTasks: completed,
      failedTasks: failed,
      successRate: total > 0 ? (completed / total) * 100 : 0,
      avgProcessingTime,
      activeSince: this.tasks.length > 0 ? this.tasks[0].createdAt : new Date().toISOString(),
      isRunning: this.isRunning
    };
  }
}

// Export singleton instance
export const coloradoSEOWorker = new ColoradoSEOWorker();

// Auto-start initial content generation
console.log('Starting initial Colorado SEO content generation...');
const initialTaskIds = coloradoSEOWorker.generateInitialContentTasks();
console.log(`Generated ${initialTaskIds.length} initial content tasks`);