'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement occupation search
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Skill Visa Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your ideal visa pathway by searching for occupations or uploading your CV for AI-powered analysis
          </p>
        </div>

        {/* Main Options with OR separator */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
            {/* Search Option - Redesigned to be longer and shorter */}
            <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Search Occupation</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Enter an occupation code or title to find relevant visa pathways
              </p>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="e.g., Software Engineer or 261313"
                  className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-1 hidden sm:inline">Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* OR Separator */}
            <div className="flex items-center justify-center">
              <div className="hidden md:block w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 font-medium">OR</span>
              </div>
              <div className="md:hidden flex items-center w-full">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-4 text-gray-500 font-medium">OR</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>
            </div>

            {/* Upload CV Option - Matching height with search but shorter width */}
            <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Upload Your CV</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Let our AI analyze your CV and suggest the best visa pathways
              </p>
              <Link
                href="/dashboard"
                className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="mr-1">Start CV Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-semibold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Search or Upload</h3>
              <p className="text-gray-600">
                Search for your occupation or upload your CV for analysis
              </p>
            </div>
            <div className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Get Matches</h3>
              <p className="text-gray-600">
                Receive occupation matches and visa pathway recommendations
              </p>
            </div>
            <div className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Assess Eligibility</h3>
              <p className="text-gray-600">
                Review detailed eligibility criteria and points calculation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}