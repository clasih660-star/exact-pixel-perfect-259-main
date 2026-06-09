import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface DashboardSearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function DashboardSearch({ placeholder, onSearch, className = "" }: DashboardSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] py-2.5 pl-10 pr-10 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--gray-600)]"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Search result types
export interface SearchResult {
  id: string;
  type: "course" | "lesson" | "student" | "teacher" | "resource" | "session";
  title: string;
  description: string;
  href: string;
  relevance?: number;
}

// Hook for dashboard search functionality
export function useDashboardSearch(searchType: "learner" | "teacher" | "institution" | "platform" | "parent") {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setIsSearching(true);

    // Simulate API search delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock search results based on role
    const mockResults: SearchResult[] = [];
    
    switch (searchType) {
      case "learner":
        mockResults.push(
          {
            id: "1",
            type: "course",
            title: "Mathematics Form 2",
            description: "Quadratic Equations chapter",
            href: "/student/courses/math_form_2",
            relevance: 0.95
          },
          {
            id: "2",
            type: "lesson",
            title: "Introduction to Quadratic Equations",
            description: "Step 3 of 8: Worked Example",
            href: "/student/lessons/quadratic_intro",
            relevance: 0.92
          },
          {
            id: "3",
            type: "resource",
            title: "Quadratics Notes.pdf",
            description: "Mathematics study material",
            href: "/student/resources/quadratics_notes",
            relevance: 0.88
          }
        );
        break;
        
      case "teacher":
        mockResults.push(
          {
            id: "1",
            type: "student",
            title: "John Doe",
            description: "Mathematics Form 2 - 86% average",
            href: "/teacher/students/john_doe",
            relevance: 0.94
          },
          {
            id: "2",
            type: "course",
            title: "Mathematics Form 2",
            description: "32 students enrolled",
            href: "/teacher/courses/math_form_2",
            relevance: 0.91
          },
          {
            id: "3",
            type: "session",
            title: "Quadratic Equations Session",
            description: "Scheduled for today at 10:30 AM",
            href: "/teacher/sessions/quadratic_session",
            relevance: 0.89
          }
        );
        break;
        
      case "institution":
        mockResults.push(
          {
            id: "1",
            type: "student",
            title: "Jane Smith",
            description: "Chemistry - 92% average",
            href: "/institution/students/jane_smith",
            relevance: 0.96
          },
          {
            id: "2",
            type: "teacher",
            title: "Ms. Mary Johnson",
            description: "Mathematics - 12 courses",
            href: "/institution/teachers/mary_johnson",
            relevance: 0.93
          },
          {
            id: "3",
            type: "course",
            title: "KCSE Chemistry Revision",
            description: "56 students enrolled",
            href: "/institution/courses/chemistry_revision",
            relevance: 0.90
          }
        );
        break;
        
      case "platform":
        mockResults.push(
          {
            id: "1",
            type: "course",
            title: "Klassruum Demo Academy",
            description: "Premium Plan - 428 students",
            href: "/admin/institutions/klassruum_demo",
            relevance: 0.97
          },
          {
            id: "2",
            type: "student",
            title: "John Doe",
            description: "Learner - Mathematics Form 2",
            href: "/admin/users/john_doe",
            relevance: 0.92
          },
          {
            id: "3",
            type: "teacher",
            title: "Ms. Mary Johnson",
            description: "Teacher - Klassruum Demo Academy",
            href: "/admin/users/mary_johnson",
            relevance: 0.89
          }
        );
        break;
        
      case "parent":
        mockResults.push(
          {
            id: "1",
            type: "student",
            title: "John Doe",
            description: "Mathematics - 86% average",
            href: "/parent/learners/john_doe",
            relevance: 0.95
          },
          {
            id: "2",
            type: "session",
            title: "Quadratic Equations",
            description: "Completed 2 hours ago - 45 min",
            href: "/parent/sessions/quadratic_session",
            relevance: 0.91
          },
          {
            id: "3",
            type: "resource",
            title: "Weekly Progress Report",
            description: "Generated 3 days ago",
            href: "/parent/reports/weekly_progress",
            relevance: 0.88
          }
        );
        break;
    }

    // Filter by query and sort by relevance
    const filteredResults = mockResults
      .filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    setResults(filteredResults);
    setIsSearching(false);
    return filteredResults;
  };

  return {
    isSearching,
    results,
    performSearch,
    clearResults: () => setResults([])
  };
}