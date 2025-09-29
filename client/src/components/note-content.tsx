import React from 'react';
import { convertTextToLinks } from '@/lib/linkUtils';

interface NoteContentProps {
  content: string;
  className?: string;
  'data-testid'?: string;
}

/**
 * Component that renders note content with clickable links
 * URLs in the content are automatically converted to clickable links that open in new tabs
 */
export default function NoteContent({ content, className, 'data-testid': testId }: NoteContentProps) {
  const contentWithLinks = convertTextToLinks(content);

  return (
    <p
      className={className}
      data-testid={testId}
    >
      {contentWithLinks}
    </p>
  );
}
