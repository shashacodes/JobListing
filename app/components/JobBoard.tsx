// src/components/JobBoard.tsx
"use client"
import React from 'react';
import { cn } from "@/app/lib/utils";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
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
    companyLogo: item.logo, // Keep the original logo path from JSON
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
  const jobListings = transformJobData(jobData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-200 to-teal-50 pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          {jobListings.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Use the logo path directly from the job data
  const logoPath = job.companyLogo;

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
      <div className="flex items-center p-6">
        <div className="relative mr-6">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src={logoPath} 
              alt={`${job.companyName} logo`}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                console.error(`Failed to load image: ${logoPath}`);
                const target = e.target as HTMLImageElement;
                // Show company initial as fallback
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

        <div className="flex flex-wrap gap-2 ml-auto">
          {job.skills.map((skill, index) => (
            <Badge 
              key={index} 
              className={cn(
                "px-3 py-1 rounded-md font-medium text-xs cursor-pointer hover:bg-teal-500 hover:text-white transition-colors",
                getSkillColor(skill.category)
              )}
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