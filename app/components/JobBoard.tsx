"use client"
import React, { useState, useEffect } from 'react';
import { cn } from "@/app/lib/utils";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";
import jobData from "@/app/components/data/data.json";

interface JobDataItem {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

function transformJobData(data: JobDataItem[]): JobListing[] {
  return data.map(item => ({
    id: item.id.toString(),
    companyName: item.company,
    companyLogo: item.logo,
    position: item.position,
    postedAt: item.postedAt,
    jobType: item.contract as JobType,
    location: item.location as JobLocation,
    isNew: item.new,
    isFeatured: item.featured,
    skills: [
      { name: item.role, category: getCategoryForSkill(item.role) },
      { name: item.level, category: 'other' },
      ...item.languages.map(lang => ({ 
        name: lang, 
        category: getCategoryForSkill(lang) 
      })),
      ...item.tools.map(tool => ({ 
        name: tool, 
        category: getCategoryForSkill(tool) 
      }))
    ]
  }));
}

function getCategoryForSkill(skill: string): Skill['category'] {
  const lowercase = skill.toLowerCase();
  
  if (['html', 'css', 'sass', 'frontend', 'react', 'vue', 'javascript', 'typescript'].includes(lowercase)) {
    return 'frontend';
  }
  
  if (['backend', 'ruby', 'ror', 'python', 'php', 'java', 'c#', 'node', 'express'].includes(lowercase)) {
    return 'backend';
  }
  
  if (['fullstack', 'full stack', 'django', 'laravel'].includes(lowercase)) {
    return 'fullstack';
  }
  
  if (['python', 'ruby', 'javascript', 'typescript', 'php', 'java', 'c#', 'go'].includes(lowercase)) {
    return 'language';
  }
  
  if (['react', 'vue', 'angular', 'svelte', 'django', 'laravel', 'rails', 'express'].includes(lowercase)) {
    return 'framework';
  }
  
  return 'other';
}

type JobType = 'Full-time' | 'Part-time' | 'Contract' | string;
type JobLocation = 'USA only' | 'Remote' | 'Worldwide' | 'UK only' | string;

interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'language' | 'framework' | 'other';
}

interface JobListing {
  id: string;
  companyName: string;
  companyLogo: string;
  position: string;
  postedAt: string;
  jobType: JobType;
  location: JobLocation;
  isNew?: boolean;
  isFeatured?: boolean;
  skills: Skill[];
}

export function JobBoard() {
  const allJobListings = transformJobData(jobData);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(allJobListings);
  const [filters, setFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (filters.length === 0 && !searchTerm) {
      setFilteredJobs(allJobListings);
      return;
    }

    const filtered = allJobListings.filter(job => {
      const matchesFilters = filters.length === 0 || 
        filters.every(filter => 
          job.skills.some(skill => 
            skill.name.toLowerCase() === filter.toLowerCase()
          )
        );
      
      const matchesSearch = !searchTerm || 
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilters && matchesSearch;
    });

    setFilteredJobs(filtered);
  }, [filters, searchTerm]);

  const addFilter = (skillName: string) => {
    if (!filters.includes(skillName)) {
      setFilters([...filters, skillName]);
    }
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter(f => f !== filter));
  };

  const clearFilters = () => {
    setFilters([]);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8  rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Button 
              className='text-black  font-bold'
                onClick={clearFilters} 
                variant="outline" 
                disabled={filters.length === 0 && !searchTerm}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {filters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <Badge 
                  key={index} 
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-md flex items-center"
                >
                  {filter}
                  <Button
                    variant="ghost"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-4 text-gray-600">
          Showing {filteredJobs.length} of {allJobListings.length} jobs
        </div>
        
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onFilterClick={addFilter} 
              />
            ))
          ) : (
            <div className="bg-white p-8 text-center rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-700">No matching jobs found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface JobCardProps {
  job: JobListing;
  onFilterClick: (skill: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onFilterClick }) => {
  const logoPath = job.companyLogo;

  return (
    <Card className=" shadow-md rounded-lg overflow-hidden border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row items-start md:items-center p-6">
        <div className="relative mr-6 mb-4 md:mb-0">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src={logoPath} 
              alt={`${job.companyName} logo`}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                console.error(`Failed to load image: ${logoPath}`);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement as HTMLElement;
                if (parent) {
                  const initial = document.createElement('div');
                  initial.className = 'w-10 h-10 flex items-center justify-center text-gray-500 font-bold text-xl';
                  initial.textContent = job.companyName.charAt(0);
                  parent.appendChild(initial);
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium text-teal-500 mr-4">{job.companyName}</h3>
            <div className="flex gap-2">
              {job.isNew && (
                <Badge className="bg-teal-500 text-white text-xs rounded-full px-2 py-0.5">
                  NEW!
                </Badge>
              )}
              {job.isFeatured && (
                <Badge className="bg-gray-800 text-white text-xs rounded-full px-2 py-0.5">
                  FEATURED
                </Badge>
              )}
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-gray-800 mb-2">{job.position}</h2>
          
          <div className="flex items-center text-gray-500 text-sm">
            <span>{job.postedAt}</span>
            <span className="mx-2">•</span>
            <span>{job.jobType}</span>
            <span className="mx-2">•</span>
            <span>{job.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:ml-auto">
          {job.skills.map((skill, index) => (
            <Badge 
              key={index} 
              className={cn(
                "px-3 py-1 rounded-md font-medium text-xs cursor-pointer hover:bg-teal-500 hover:text-white transition-colors",
                getSkillColor(skill.category)
              )}
              onClick={() => onFilterClick(skill.name)}
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

function getSkillColor(category: Skill['category']): string {
  switch (category) {
    case 'frontend':
      return "bg-teal-100 text-teal-700";
    case 'backend':
      return "bg-blue-100 text-blue-700";
    case 'fullstack':
      return "bg-purple-100 text-purple-700";
    case 'language':
      return "bg-green-100 text-green-700";
    case 'framework':
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function JobBoardPage() {
  return <JobBoard />;
}