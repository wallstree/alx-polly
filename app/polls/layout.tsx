import React from 'react';

export default function PollsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20 py-8">
      {children}
    </div>
  );
}