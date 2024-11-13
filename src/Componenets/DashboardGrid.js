import React from 'react';
import Box from './Box';

const DashboardGrid = ({ counts }) => {
  const sections = [
    { title: 'Users', count: counts.users },
    { title: 'Posts', count: counts.posts },
    { title: 'Comments', count: counts.comments },
    { title: 'Albums', count: counts.albums },
    { title: 'Todos', count: counts.todos },
    { title: 'Photos', count: counts.photos },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <Box key={section.title} title={section.title} count={section.count} />
      ))}
    </div>
  );
};

export default DashboardGrid;
