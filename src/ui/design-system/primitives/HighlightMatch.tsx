export interface HighlightMatchProps {
  text: string;
  query: string;
  className?: string;
}

export function HighlightMatch({ text, query, className }: HighlightMatchProps) {
  if (!query) return <span className={className}>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.slice(0, idx)}
      <mark
        className="rounded-sm p-0"
        style={{
          background: 'rgba(201,100,66,0.22)',
          color: 'inherit',
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}
