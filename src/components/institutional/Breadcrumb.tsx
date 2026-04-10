import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export function Breadcrumb() {
  const location = useLocation();
  
  // Generate breadcrumb from path
  const paths = location.pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = paths.map((path, index) => {
    const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
    // Institutional Formatting: Capitalize and replace hyphens
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return { label, path: fullPath };
  });

  // Schema.org structured data (BreadcrumbList)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Omni-View',
        item: 'https://ifxtrades.com/dashboard'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `https://ifxtrades.com${item.path}`
      }))
    ]
  };

  if (items.length === 0) return null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-8 px-2">
        <Link to="/dashboard" className="hover:text-emerald-500 transition-colors flex items-center gap-2 group">
          <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="sr-only">Home</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={item.path} className="flex items-center gap-3">
            <ChevronRight className="w-3 h-3 text-white/10" />
            {index === items.length - 1 ? (
              <span className="text-emerald-500 italic tracking-widest" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
