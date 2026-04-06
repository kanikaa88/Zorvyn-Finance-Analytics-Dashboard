/**
 * Request logging middleware
 * Logs: method, URL, status code, response time
 * No external dependencies - uses built-in Node.js functionality
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture the original end function
  const originalEnd = res.end;
  
  // Override res.end to log after response is sent
  res.end = function(...args) {
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Get status code
    const statusCode = res.statusCode;
    
    // Determine color based on status code
    const getStatusColor = (code) => {
      if (code >= 500) return '\x1b[31m'; // Red for 5xx
      if (code >= 400) return '\x1b[33m'; // Yellow for 4xx
      if (code >= 300) return '\x1b[36m'; // Cyan for 3xx
      if (code >= 200) return '\x1b[32m'; // Green for 2xx
      return '\x1b[0m'; // Default
    };
    
    const statusColor = getStatusColor(statusCode);
    const resetColor = '\x1b[0m';
    const methodColor = '\x1b[35m'; // Magenta for method
    const timeColor = '\x1b[90m'; // Gray for time
    
    // Format log message
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    
    // Print clean log
    console.log(
      `${timeColor}[${timestamp}]${resetColor} ` +
      `${methodColor}${method}${resetColor} ` +
      `${url} ` +
      `${statusColor}${statusCode}${resetColor} ` +
      `${timeColor}${responseTime}ms${resetColor}`
    );
    
    // Call the original end function
    originalEnd.apply(res, args);
  };
  
  next();
};

module.exports = { requestLogger };
