import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, DollarSign, Briefcase, Wrench, Users, MapPin, Database, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { parseJobDataset, getJobsByField, analyzeFieldData, type JobData } from '@/utils/csvParser';

interface JobRole {
  title: string;
  count: number;
}

interface Skill {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
}

interface SalaryRanges {
  min: number;
  avg: number;
  max: number;
  currency: string;
}

interface GrowthOutlook {
  trend: 'Growing' | 'Stable' | 'Declining';
  description: string;
}

interface CareerInsights {
  growthOutlook: GrowthOutlook;
  salaryRanges: SalaryRanges;
  jobRoles: JobRole[];
  technicalSkills: Skill[];
  softSkills: Skill[];
  topLocations: string[];
  marketDemand: string;
}

export const JobScraper = () => {
  const [careerField, setCareerField] = useState('');
  const [location, setLocation] = useState('India');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<CareerInsights | null>(null);
  const [datasetJobs, setDatasetJobs] = useState<JobData[]>([]);
  const [allJobs, setAllJobs] = useState<JobData[]>([]);
  const [datasetAnalysis, setDatasetAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDataset = async () => {
      const jobs = await parseJobDataset();
      setAllJobs(jobs);
    };
    loadDataset();
  }, []);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImportanceBadgeColor = (importance: string) => {
    switch (importance) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!careerField) {
      toast({
        title: "Error",
        description: "Please enter a career field",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setInsights(null);

    try {
      console.log('Analyzing career field:', careerField);
      
      const { data, error } = await supabase.functions.invoke('analyze-career', {
        body: { careerField, location }
      });

      if (error) throw error;

      if (data?.insights) {
        setInsights(data.insights);
        toast({
          title: "Success",
          description: "Career insights generated successfully",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze career field",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatasetSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!careerField || allJobs.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a career field",
        variant: "destructive",
      });
      return;
    }
    
    const matchingJobs = getJobsByField(allJobs, careerField);
    setDatasetJobs(matchingJobs);
    
    const analysis = analyzeFieldData(matchingJobs);
    setDatasetAnalysis(analysis);
    
    if (matchingJobs.length === 0) {
      toast({
        title: "No matches found",
        description: `No jobs found for "${careerField}" in the dataset`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Dataset searched",
        description: `Found ${matchingJobs.length} jobs with ${analysis?.totalOpenings || 0} total openings`,
      });
    }
  };

  const predefinedFields = [
    'Data Analyst',
    'Software Developer',
    'Digital Marketing',
    'UI/UX Designer',
    'Product Manager',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Insights Analyzer</CardTitle>
          <CardDescription>
            Choose between AI-powered insights or search through real job dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">🤖 AI Insights</TabsTrigger>
              <TabsTrigger value="dataset">
                <Database className="w-4 h-4 mr-2" />
                Dataset Search
              </TabsTrigger>
            </TabsList>

            {/* AI Insights Tab */}
            <TabsContent value="ai" className="space-y-4">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ai-careerField" className="text-sm font-medium">
                      Career Field
                    </label>
                    <Input
                      id="ai-careerField"
                      type="text"
                      value={careerField}
                      onChange={(e) => setCareerField(e.target.value)}
                      placeholder="e.g., Data Analyst, Doctor, Teacher"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ai-location" className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id="ai-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="India"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground w-full">Popular fields:</span>
                  {predefinedFields.map((field) => (
                    <Button
                      key={field}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCareerField(field)}
                      disabled={isLoading}
                    >
                      {field}
                    </Button>
                  ))}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing with ML...
                    </>
                  ) : (
                    '🤖 Generate AI Insights'
                  )}
                </Button>
              </form>

              {insights && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">AI Insights: {careerField}</h3>
                  </div>

                  {/* Growth Outlook */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Growth Outlook
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="secondary" className="text-base">
                        {insights.growthOutlook.trend}
                      </Badge>
                      <p className="text-muted-foreground">{insights.growthOutlook.description}</p>
                      <p className="text-sm mt-2">{insights.marketDemand}</p>
                    </CardContent>
                  </Card>

                  {/* Salary Range */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Salary Ranges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Minimum</p>
                          <p className="text-lg font-semibold">{formatINR(insights.salaryRanges.min)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average</p>
                          <p className="text-lg font-semibold">{formatINR(insights.salaryRanges.avg)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Maximum</p>
                          <p className="text-lg font-semibold">{formatINR(insights.salaryRanges.max)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Roles */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Common Job Roles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {insights.jobRoles.map((role, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                            <span className="font-medium">{role.title}</span>
                            <Badge variant="outline">{role.count}+ openings</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technical Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Technical Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {insights.technicalSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className={getImportanceBadgeColor(skill.importance)}>
                            {skill.skill} • {skill.importance}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Soft Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Soft Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {insights.softSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className={getImportanceBadgeColor(skill.importance)}>
                            {skill.skill} • {skill.importance}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Locations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Top Hiring Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {insights.topLocations.map((loc, index) => (
                          <Badge key={index} variant="secondary">
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Dataset Search Tab */}
            <TabsContent value="dataset" className="space-y-4">
              <form onSubmit={handleDatasetSearch} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="dataset-careerField" className="text-sm font-medium">
                    Search Career Field
                  </label>
                  <Input
                    id="dataset-careerField"
                    type="text"
                    value={careerField}
                    onChange={(e) => setCareerField(e.target.value)}
                    placeholder="e.g., Data Analyst, Android Developer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Searching {allJobs.length} real job listings from Indian companies
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground w-full">Popular fields:</span>
                  {predefinedFields.map((field) => (
                    <Button
                      key={field}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCareerField(field)}
                    >
                      {field}
                    </Button>
                  ))}
                </div>

                <Button type="submit" className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Search Dataset
                </Button>
              </form>

              {datasetAnalysis && datasetJobs.length > 0 && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Dataset Results: {careerField}</h3>
                    <Badge variant="outline">{datasetJobs.length} jobs found</Badge>
                  </div>

                  {/* Summary Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Market Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Openings</p>
                          <p className="text-2xl font-bold">{datasetAnalysis.totalOpenings}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Companies</p>
                          <p className="text-2xl font-bold">{datasetAnalysis.companies.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Min Exp</p>
                          <p className="text-2xl font-bold">{datasetAnalysis.avgExperience.min}y</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Max Exp</p>
                          <p className="text-2xl font-bold">{datasetAnalysis.avgExperience.max}y</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Salary Range */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Salary Ranges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Minimum</p>
                          <p className="text-lg font-semibold">{formatINR(datasetAnalysis.salaryRange.minimum)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average</p>
                          <p className="text-lg font-semibold">{formatINR(datasetAnalysis.salaryRange.average)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Maximum</p>
                          <p className="text-lg font-semibold">{formatINR(datasetAnalysis.salaryRange.maximum)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Roles */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Top Job Roles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {datasetAnalysis.topRoles.map((role: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                            <span className="font-medium">{role.title}</span>
                            <Badge variant="outline">{role.count} openings</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Required Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {datasetAnalysis.topSkills.map((skill: any, index: number) => (
                          <Badge key={index} variant="outline" className={getImportanceBadgeColor(skill.importance)}>
                            {skill.name} • {skill.importance}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Companies Hiring */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Companies Hiring ({datasetAnalysis.companies.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {datasetAnalysis.companies.slice(0, 15).map((company: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {company}
                          </Badge>
                        ))}
                        {datasetAnalysis.companies.length > 15 && (
                          <Badge variant="outline">+{datasetAnalysis.companies.length - 15} more</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
