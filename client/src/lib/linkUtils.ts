/**
 * Utility functions for detecting and converting URLs to clickable links
 */

import React from 'react';

// URL regex pattern that matches http/https URLs
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/**
 * Converts plain text containing URLs into JSX elements with clickable links
 * @param text - The text content that may contain URLs
 * @returns Array of JSX elements (text and links)
 */
export function convertTextToLinks(text: string): (string | React.ReactElement)[] {
  if (!text) return [text];

  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex to ensure we start from the beginning
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const url = match[0];
    const matchIndex = match.index;

    // Add text before the URL
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    // Add the clickable link
    parts.push(
      React.createElement('a', {
        key: matchIndex,
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-600 hover:text-blue-800 underline break-all',
        onClick: (e: React.MouseEvent) => e.stopPropagation()
      }, url)
    );

    lastIndex = matchIndex + url.length;
  }

  // Add remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Checks if a given text contains any URLs
 * @param text - The text to check
 * @returns true if the text contains URLs, false otherwise
 */
export function containsUrls(text: string): boolean {
  if (!text) return false;
  URL_REGEX.lastIndex = 0;
  return URL_REGEX.test(text);
}
