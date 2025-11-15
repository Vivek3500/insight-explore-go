export interface JobData {
  companyName: string;
  companyType: string;
  jobTitle: string;
  numberOfOpenings: number;
  requiredSkills: string[];
  salaryRange: string;
  minExperience: number;
  maxExperience: number;
}

export const parseJobDataset = async (): Promise<JobData[]> => {
  try {
    const response = await fetch('/jobDataset.csv');
    const text = await response.text();
    
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      return {
        companyName: values[0],
        companyType: values[1],
        jobTitle: values[2],
        numberOfOpenings: parseInt(values[3]) || 0,
        requiredSkills: values[4].split(',').map(s => s.trim()),
        salaryRange: values[5],
        minExperience: parseInt(values[6]) || 0,
        maxExperience: parseInt(values[7]) || 0,
      };
    });
  } catch (error) {
    console.error('Error parsing job dataset:', error);
    return [];
  }
};

// Helper to handle CSV values with commas inside quotes
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const getJobsByField = (jobs: JobData[], fieldName: string): JobData[] => {
  const fieldKeywords = fieldName.toLowerCase().split(' ');
  
  return jobs.filter(job => {
    const jobTitleLower = job.jobTitle.toLowerCase();
    const skillsLower = job.requiredSkills.join(' ').toLowerCase();
    
    return fieldKeywords.some(keyword => 
      jobTitleLower.includes(keyword) || skillsLower.includes(keyword)
    );
  });
};

export const analyzeFieldData = (jobs: JobData[]) => {
  if (jobs.length === 0) return null;
  
  // Calculate total openings
  const totalOpenings = jobs.reduce((sum, job) => sum + job.numberOfOpenings, 0);
  
  // Get unique job titles with counts
  const roleCounts = jobs.reduce((acc, job) => {
    acc[job.jobTitle] = (acc[job.jobTitle] || 0) + job.numberOfOpenings;
    return acc;
  }, {} as Record<string, number>);
  
  const topRoles = Object.entries(roleCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([title, count]) => ({ title, count }));
  
  // Get all skills with frequency
  const skillCounts = jobs.reduce((acc, job) => {
    job.requiredSkills.forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ 
      name, 
      importance: count > jobs.length * 0.5 ? 'High' : count > jobs.length * 0.25 ? 'Medium' : 'Low' 
    }));
  
  // Parse salary ranges
  const salaries = jobs.map(job => {
    const match = job.salaryRange.match(/₹([\d,]+)\s*-\s*₹([\d,]+)/);
    if (match) {
      return {
        min: parseInt(match[1].replace(/,/g, '')),
        max: parseInt(match[2].replace(/,/g, ''))
      };
    }
    return null;
  }).filter(Boolean) as { min: number; max: number }[];
  
  const avgMinSalary = Math.round(salaries.reduce((sum, s) => sum + s.min, 0) / salaries.length);
  const avgMaxSalary = Math.round(salaries.reduce((sum, s) => sum + s.max, 0) / salaries.length);
  const avgSalary = Math.round((avgMinSalary + avgMaxSalary) / 2);
  
  // Get company distribution
  const companies = [...new Set(jobs.map(j => j.companyName))];
  
  return {
    totalOpenings,
    topRoles,
    topSkills,
    salaryRange: {
      minimum: avgMinSalary,
      average: avgSalary,
      maximum: avgMaxSalary
    },
    companies,
    avgExperience: {
      min: Math.round(jobs.reduce((sum, j) => sum + j.minExperience, 0) / jobs.length),
      max: Math.round(jobs.reduce((sum, j) => sum + j.maxExperience, 0) / jobs.length)
    }
  };
};
