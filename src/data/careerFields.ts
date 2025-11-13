export interface JobRole {
  title: string;
  description: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
}

export interface SkillCategory {
  technical: string[];
  soft: string[];
}

export interface SalaryRange {
  entry: string;
  mid: string;
  senior: string;
}

export interface CareerField {
  id: string;
  name: string;
  icon: string;
  description: string;
  shortDescription: string;
  jobRoles: JobRole[];
  skills: SkillCategory;
  salaryRanges: SalaryRange;
  growthOutlook: {
    trend: 'Growing' | 'Stable' | 'Declining';
    percentage: string;
    description: string;
  };
  stateData?: {
    [state: string]: {
      averageSalary: string;
      jobOpenings: number;
    };
  };
}

export const careerFields: CareerField[] = [
  {
    id: 'information-technology',
    name: 'Information Technology',
    icon: 'Code',
    shortDescription: 'Build and maintain digital solutions that power modern business',
    description: 'Information Technology encompasses software development, system administration, cybersecurity, and technical support roles. IT professionals design, develop, and maintain technology systems that enable businesses to operate efficiently.',
    jobRoles: [
      {
        title: 'Software Developer',
        description: 'Design and build applications, websites, and software systems',
        experienceLevel: 'Entry'
      },
      {
        title: 'DevOps Engineer',
        description: 'Automate deployment processes and maintain infrastructure',
        experienceLevel: 'Mid'
      },
      {
        title: 'Solutions Architect',
        description: 'Design comprehensive technical solutions for complex business problems',
        experienceLevel: 'Senior'
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Protect systems and data from security threats',
        experienceLevel: 'Mid'
      },
      {
        title: 'Data Engineer',
        description: 'Build and maintain data pipelines and infrastructure',
        experienceLevel: 'Mid'
      }
    ],
    skills: {
      technical: ['Programming (Python, Java, JavaScript)', 'Cloud Platforms (AWS, Azure)', 'Database Management', 'Version Control (Git)', 'System Architecture'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Collaboration', 'Continuous Learning', 'Communication']
    },
    salaryRanges: {
      entry: '₹3,50,000 - ₹6,00,000',
      mid: '₹8,00,000 - ₹15,00,000',
      senior: '₹18,00,000 - ₹35,00,000+'
    },
    growthOutlook: {
      trend: 'Growing',
      percentage: '25%',
      description: 'Strong growth driven by India\'s digital transformation and IT services expansion'
    }
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'Heart',
    shortDescription: 'Care for patients and improve public health outcomes',
    description: 'Healthcare professionals diagnose, treat, and prevent illness while promoting wellness. This field includes clinical roles, research positions, and administrative healthcare management.',
    jobRoles: [
      {
        title: 'Registered Nurse',
        description: 'Provide patient care and coordinate treatment plans',
        experienceLevel: 'Entry'
      },
      {
        title: 'Physician Assistant',
        description: 'Diagnose illnesses and develop treatment plans under physician supervision',
        experienceLevel: 'Mid'
      },
      {
        title: 'Healthcare Administrator',
        description: 'Manage healthcare facilities and coordinate medical services',
        experienceLevel: 'Senior'
      },
      {
        title: 'Medical Lab Technician',
        description: 'Conduct laboratory tests and analyze results',
        experienceLevel: 'Entry'
      }
    ],
    skills: {
      technical: ['Clinical Knowledge', 'Medical Technology', 'Electronic Health Records', 'Diagnostic Procedures', 'Patient Care Protocols'],
      soft: ['Empathy', 'Communication', 'Critical Thinking', 'Stress Management', 'Attention to Detail']
    },
    salaryRanges: {
      entry: '₹3,00,000 - ₹5,00,000',
      mid: '₹6,00,000 - ₹10,00,000',
      senior: '₹12,00,000 - ₹20,00,000+'
    },
    growthOutlook: {
      trend: 'Growing',
      percentage: '16%',
      description: 'Growing healthcare infrastructure and medical tourism boosting sector demand'
    }
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    icon: 'TrendingUp',
    shortDescription: 'Manage financial resources and drive business growth',
    description: 'Finance professionals analyze financial data, manage investments, and provide strategic guidance for individuals and organizations. Roles range from financial planning to investment banking.',
    jobRoles: [
      {
        title: 'Financial Analyst',
        description: 'Analyze financial data and provide investment recommendations',
        experienceLevel: 'Entry'
      },
      {
        title: 'Portfolio Manager',
        description: 'Manage investment portfolios and maximize returns',
        experienceLevel: 'Senior'
      },
      {
        title: 'Financial Planner',
        description: 'Help clients achieve financial goals through strategic planning',
        experienceLevel: 'Mid'
      },
      {
        title: 'Risk Analyst',
        description: 'Assess and mitigate financial risks for organizations',
        experienceLevel: 'Mid'
      }
    ],
    skills: {
      technical: ['Financial Modeling', 'Data Analysis', 'Excel & Analytics Tools', 'Accounting Principles', 'Regulatory Compliance'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Decision Making', 'Ethics']
    },
    salaryRanges: {
      entry: '₹3,50,000 - ₹6,00,000',
      mid: '₹7,00,000 - ₹12,00,000',
      senior: '₹15,00,000 - ₹30,00,000+'
    },
    growthOutlook: {
      trend: 'Stable',
      percentage: '8%',
      description: 'Steady growth in BFSI sector with fintech creating new opportunities'
    }
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    shortDescription: 'Shape minds and build the future through teaching',
    description: 'Education professionals teach, mentor, and develop curriculum to help students learn and grow. This includes K-12 teaching, higher education, and educational administration.',
    jobRoles: [
      {
        title: 'Elementary Teacher',
        description: 'Teach fundamental subjects to young students',
        experienceLevel: 'Entry'
      },
      {
        title: 'Curriculum Specialist',
        description: 'Design and evaluate educational programs and materials',
        experienceLevel: 'Mid'
      },
      {
        title: 'School Principal',
        description: 'Lead school operations and manage educational staff',
        experienceLevel: 'Senior'
      },
      {
        title: 'Special Education Teacher',
        description: 'Adapt curriculum for students with diverse learning needs',
        experienceLevel: 'Entry'
      }
    ],
    skills: {
      technical: ['Curriculum Development', 'Educational Technology', 'Assessment Methods', 'Classroom Management', 'Learning Theories'],
      soft: ['Patience', 'Communication', 'Creativity', 'Adaptability', 'Leadership']
    },
    salaryRanges: {
      entry: '₹2,50,000 - ₹4,50,000',
      mid: '₹5,00,000 - ₹8,00,000',
      senior: '₹9,00,000 - ₹15,00,000+'
    },
    growthOutlook: {
      trend: 'Stable',
      percentage: '5%',
      description: 'NEP 2020 implementation and ed-tech growth creating steady opportunities'
    }
  },
  {
    id: 'marketing',
    name: 'Marketing & Communications',
    icon: 'Megaphone',
    shortDescription: 'Connect brands with audiences through strategic messaging',
    description: 'Marketing professionals develop strategies to promote products and services, build brand awareness, and engage customers through various channels including digital, social, and traditional media.',
    jobRoles: [
      {
        title: 'Marketing Coordinator',
        description: 'Support marketing campaigns and manage promotional materials',
        experienceLevel: 'Entry'
      },
      {
        title: 'Digital Marketing Manager',
        description: 'Lead online marketing strategies and campaigns',
        experienceLevel: 'Mid'
      },
      {
        title: 'Brand Director',
        description: 'Develop and oversee brand strategy across all touchpoints',
        experienceLevel: 'Senior'
      },
      {
        title: 'Content Strategist',
        description: 'Plan and create engaging content for target audiences',
        experienceLevel: 'Mid'
      }
    ],
    skills: {
      technical: ['Digital Marketing Tools', 'Analytics & Metrics', 'SEO/SEM', 'Content Management Systems', 'Social Media Platforms'],
      soft: ['Creativity', 'Communication', 'Strategic Thinking', 'Collaboration', 'Adaptability']
    },
    salaryRanges: {
      entry: '₹3,00,000 - ₹5,00,000',
      mid: '₹6,00,000 - ₹10,00,000',
      senior: '₹12,00,000 - ₹20,00,000+'
    },
    growthOutlook: {
      trend: 'Growing',
      percentage: '10%',
      description: 'Digital India and D2C boom driving strong demand for marketing professionals'
    }
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: 'Cog',
    shortDescription: 'Design and build solutions to technical challenges',
    description: 'Engineers apply scientific and mathematical principles to design, develop, and improve systems, structures, and products across various disciplines including mechanical, electrical, and civil engineering.',
    jobRoles: [
      {
        title: 'Mechanical Engineer',
        description: 'Design mechanical systems and products',
        experienceLevel: 'Entry'
      },
      {
        title: 'Project Engineer',
        description: 'Manage engineering projects from concept to completion',
        experienceLevel: 'Mid'
      },
      {
        title: 'Chief Engineer',
        description: 'Lead engineering teams and oversee technical strategy',
        experienceLevel: 'Senior'
      },
      {
        title: 'Quality Assurance Engineer',
        description: 'Ensure products meet quality standards and specifications',
        experienceLevel: 'Entry'
      }
    ],
    skills: {
      technical: ['CAD Software', 'Engineering Principles', 'Project Management', 'Technical Analysis', 'Quality Control'],
      soft: ['Problem Solving', 'Attention to Detail', 'Teamwork', 'Innovation', 'Communication']
    },
    salaryRanges: {
      entry: '₹3,50,000 - ₹6,00,000',
      mid: '₹7,00,000 - ₹12,00,000',
      senior: '₹15,00,000 - ₹25,00,000+'
    },
    growthOutlook: {
      trend: 'Stable',
      percentage: '7%',
      description: 'Infrastructure development and Make in India driving consistent engineering demand'
    }
  }
];
