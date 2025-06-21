import React from 'react';
import SimpleSharedEventManager from '@/components/SimpleSharedEventManager';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Expenso Together
          </h1>
          <p className="text-lg text-gray-600">
            Create shared events and track group expenses with friends, no sign-up required.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <SimpleSharedEventManager />
        </div>
      </div>
    </div>
  );
};

export default Index;
