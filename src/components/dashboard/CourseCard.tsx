import { Link } from "@tanstack/react-router";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import type { CourseCardData } from "@/lib/types";

interface CourseCardProps {
  course: CourseCardData;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/classroom/${course.id}`} className="block">
      <div className="classroom-item card">
        <div
          className="class-icon"
          style={{ background: `${course.color}15`, color: course.color }}
        >
          {course.thumbnail || <BookOpen size={20} />}
        </div>
        <div className="class-info">
          <div className="class-name">{course.title}</div>
          <div className="class-sub">
            {course.subject} · {course.level}
          </div>
          <div className="class-progress">
            <div className="progress-bar flex-1">
              <div
                className="progress-fill"
                style={{
                  width: `${course.progress}%`,
                  background: course.color,
                }}
              />
            </div>
            <div className="class-pct" style={{ color: course.color }}>
              {course.progress}%
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
