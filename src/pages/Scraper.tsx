import { Navigation } from '@/components/Navigation';
import { JobScraper } from '@/components/JobScraper';

const Scraper = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2"> Career Search & Insights</h1>
          <p className="text-muted-foreground">
            ML-powered job market analysis using real-time data
          </p>
        </div>
        <JobScraper />
      </main>
    </div>
  );
};

export default Scraper;
