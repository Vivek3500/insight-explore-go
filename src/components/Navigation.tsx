import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-hero">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            HireSight
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={location.pathname === '/fields' ? 'default' : 'ghost'}
            asChild
            size="sm"
          >
            <Link to="/fields">Explore Fields</Link>
          </Button>
          <Button
            variant={location.pathname === '/bookmarks' ? 'default' : 'ghost'}
            asChild
            size="sm"
          >
            <Link to="/bookmarks" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
