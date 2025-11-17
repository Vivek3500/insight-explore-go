import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, BookOpen, Compass, ArrowRight } from 'lucide-react';
import InteractiveHero from '@/components/InteractiveHero';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Interactive Hero Section with Fog Effect */}
      <InteractiveHero />

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-lg text-muted-foreground">
              Make informed career decisions with comprehensive insights at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mx-auto">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Detailed Role Insights</h3>
              <p className="text-muted-foreground">
                Explore job titles, responsibilities, and career progression paths for each field
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Market Trends</h3>
              <p className="text-muted-foreground">
                Understand growth outlook, salary ranges, and demand in your region
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mx-auto">
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Skill Roadmaps</h3>
              <p className="text-muted-foreground">
                See exactly what technical and soft skills you need to develop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl p-8 sm:p-12 shadow-soft border border-border">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Find Your Path?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands exploring their career options with confidence
            </p>
            <Button asChild size="lg" className="text-base group">
              <Link to="/fields" className="flex items-center gap-2">
                Explore Career Fields
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
