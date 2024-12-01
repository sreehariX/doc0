interface RequestLimit {
    count: number;
    timestamp: number;
    nextAllowedTime: number;
  }
  
  export class RequestLimiter {
    private static readonly STORAGE_KEY = 'doc0_request_limit';
    private static readonly LIMIT_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    private static readonly FREE_REQUESTS = 10;
  
    static getLimit(): RequestLimit | null {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const limit = JSON.parse(stored);
      const now = Date.now();
      
      if (now >= limit.nextAllowedTime) {
        this.resetLimit();
        return null;
      }
      
      return limit;
    }
  
    static initializeLimit(): RequestLimit {
      const limit = {
        count: this.FREE_REQUESTS,
        timestamp: Date.now(),
        nextAllowedTime: Date.now() + this.LIMIT_DURATION
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limit));
      return limit;
    }
  
    static resetLimit(): void {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  
    static decrementCount(): void {
      const limit = this.getLimit() || this.initializeLimit();
      if (limit.count > 0) {
        limit.count--;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limit));
      }
    }
  
    static getRemainingRequests(): number {
      const limit = this.getLimit() || this.initializeLimit();
      return limit.count;
    }
  }