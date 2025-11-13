import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  experience?: string;
  skills?: string[];
  description?: string;
  rawData?: string;
}

export const JobScraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { toast } = useToast();

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setJobs([]);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: { url }
      });

      if (error) throw error;

      if (data?.jobs) {
        setJobs(data.jobs);
        toast({
          title: "Success",
          description: `Extracted ${data.jobs.length} job listings`,
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedUrls = [
    { name: 'Naukri.com', url: 'https://www.naukri.com/' },
    { name: 'Indeed India', url: 'https://in.indeed.com/' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Data Scraper</CardTitle>
          <CardDescription>
            Extract job listings from career websites using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleScrape} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Website URL
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.naukri.com/"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground w-full">Quick links:</span>
              {predefinedUrls.map((site) => (
                <Button
                  key={site.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUrl(site.url)}
                  disabled={isLoading}
                >
                  {site.name}
                </Button>
              ))}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting Jobs...
                </>
              ) : (
                'Extract Jobs'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {jobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Extracted Jobs ({jobs.length})
          </h3>
          {jobs.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {job.title || 'Job Listing'}
                </CardTitle>
                {job.company && (
                  <CardDescription>{job.company}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {job.location && (
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                )}
                {job.salary && (
                  <p className="text-sm">
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                )}
                {job.experience && (
                  <p className="text-sm">
                    <span className="font-medium">Experience:</span> {job.experience}
                  </p>
                )}
                {job.skills && job.skills.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.description && (
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                )}
                {job.rawData && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{job.rawData}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
