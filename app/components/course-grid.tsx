import { CourseCard } from "~/components/course-card";
import { portableTextToPlain } from "~/lib/portable-text";

interface CourseItem {
  _id: string;
  title: string;
  slug: { current: string };
  highlight?: unknown;
  price?: number;
  is_external?: boolean;
  imageUrl?: string | null;
  status?: "open" | "preparing";
}

interface CourseGridProps {
  courses: CourseItem[];
  emptyMessage?: string;
}

function highlightToString(value: unknown): string | undefined {
  if (typeof value === "string") return value || undefined;
  const plain = portableTextToPlain(value);
  return plain || undefined;
}

export function CourseGrid({
  courses,
  emptyMessage = "Momentálně nejsou k dispozici žádné kurzy.",
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          title={course.title}
          slug={course.slug.current}
          highlight={highlightToString(course.highlight)}
          price={course.price}
          isExternal={course.is_external}
          imageUrl={course.imageUrl ?? undefined}
          status={course.status}
        />
      ))}
    </div>
  );
}
