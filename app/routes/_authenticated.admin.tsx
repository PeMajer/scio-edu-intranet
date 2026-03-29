import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { PageHeader } from "~/components/layout/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { ChevronDown, ChevronUp, ChevronsUpDown, Settings2, Filter, X, Trash2 } from "lucide-react";
import { FilterChip } from "~/components/filter-chip";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type { Course } from "~/lib/sanity.server";

const sectionLabels: Record<string, string> = {
  novacek: "Nováček",
  rust: "Osobní růst",
  tymy: "Pro týmy",
  cesty: "Vzdělávací cesty",
};

const statusConfig = {
  enrolled: { label: "Přihlášen", variant: "brand-accent" as const },
  completed: { label: "Dokončeno", variant: "brand" as const },
  cancelled: { label: "Zrušeno", variant: "destructive" as const },
};

type EnrichedEnrollment = {
  id: string;
  user_id: string;
  course_id: string;
  term_index: number;
  enrolled_at: string;
  status: string;
  userName: string;
  userEmail: string;
  courseName: string;
  courseSection: string;
  termDate: string;
  termLocation: string;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { supabase, headers } = await requireAdmin(request, context);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      *,
      profile:profiles(*)
    `)
    .order("enrolled_at", { ascending: false });

  // Fetch emails via service_role client (anon key can't access auth.users)
  const env = context.env as Record<string, string>;
  const emailMap = new Map<string, string>();
  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
      const { data: authData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (authData?.users) {
        for (const u of authData.users) {
          if (u.email) emailMap.set(u.id, u.email);
        }
      }
    } catch {
      // Service role key missing or invalid — emails will show "—"
    }
  }

  const courseIds = [...new Set((enrollments || []).map((e: any) => e.course_id))];

  let courseMap = new Map<string, Course>();
  if (courseIds.length > 0) {
    const sanity = createSanityClient(context);
    const courses = await sanity.fetch<Course[]>(
      `*[_type == "course" && _id in $ids]{ _id, title, slug, section, dates }`,
      { ids: courseIds }
    );
    courseMap = new Map(courses.map((c) => [c._id, c]));
  }

  const enriched: EnrichedEnrollment[] = (enrollments || []).map((e: any) => {
    const course = courseMap.get(e.course_id);
    const term = course?.dates?.[e.term_index];
    return {
      id: e.id,
      user_id: e.user_id,
      course_id: e.course_id,
      term_index: e.term_index,
      enrolled_at: e.enrolled_at,
      status: e.status,
      userName: e.profile?.full_name || "N/A",
      userEmail: emailMap.get(e.user_id) || "—",
      courseName: course?.title || "Neznámý kurz",
      courseSection: course?.section ? (sectionLabels[course.section] || course.section) : "—",
      termDate: term?.date_start || "",
      termLocation: term?.location || "",
    };
  });

  return json({ enrollments: enriched }, { headers });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { supabase, headers } = await requireAdmin(request, context);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "admin-cancel") {
    const enrollmentId = formData.get("enrollmentId") as string;
    if (!enrollmentId) {
      return json({ error: "Chybí ID přihlášky" }, { status: 400, headers });
    }

    const { error } = await supabase
      .from("enrollments")
      .update({ status: "cancelled" })
      .eq("id", enrollmentId)
      .eq("status", "enrolled");

    if (error) {
      return json({ error: "Nepodařilo se odhlásit uživatele" }, { status: 500, headers });
    }

    return json({ success: true }, { headers });
  }

  return json({ error: "Neznámá akce" }, { status: 400, headers });
}

type SortKey = keyof EnrichedEnrollment;
type SortDir = "asc" | "desc";

const allColumns = [
  { key: "userName" as SortKey, label: "Uživatel", defaultVisible: true },
  { key: "userEmail" as SortKey, label: "Email", defaultVisible: true },
  { key: "courseName" as SortKey, label: "Kurz", defaultVisible: true },
  { key: "courseSection" as SortKey, label: "Kategorie", defaultVisible: true },
  { key: "termDate" as SortKey, label: "Termín kurzu", defaultVisible: true },
  { key: "termLocation" as SortKey, label: "Místo", defaultVisible: true },
  { key: "enrolled_at" as SortKey, label: "Přihlášen dne", defaultVisible: true },
  { key: "status" as SortKey, label: "Status", defaultVisible: true },
];

function safeFormatDate(value: string | undefined | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return format(d, "d. M. yyyy", { locale: cs });
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== column) return <ChevronsUpDown size={14} className="text-muted-foreground/40" />;
  return sortDir === "asc"
    ? <ChevronUp size={14} className="text-brand-primary" />
    : <ChevronDown size={14} className="text-brand-primary" />;
}

const STORAGE_KEY = "admin-table-state";

type TableState = {
  sortKey: SortKey | null;
  sortDir: SortDir;
  visibleCols: SortKey[];
  filterCourse: string;
  filterSection: string;
  filterPeriod: string;
  filterStatus: string;
};

function loadTableState(): Partial<TableState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTableState(state: TableState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable
  }
}

export default function Admin() {
  const { enrollments } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ error?: string; success?: boolean }>();
  const [cancelTarget, setCancelTarget] = useState<EnrichedEnrollment | null>(null);

  const [saved] = useState(loadTableState);
  const [sortKey, setSortKey] = useState<SortKey | null>(saved.sortKey ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(saved.sortDir ?? "asc");
  const [visibleCols, setVisibleCols] = useState<Set<SortKey>>(
    () => new Set(saved.visibleCols ?? allColumns.filter((c) => c.defaultVisible).map((c) => c.key))
  );
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterCourse, setFilterCourse] = useState<string>(saved.filterCourse ?? "");
  const [filterSection, setFilterSection] = useState<string>(saved.filterSection ?? "");
  const [filterPeriod, setFilterPeriod] = useState<string>(saved.filterPeriod ?? "");
  const [filterStatus, setFilterStatus] = useState<string>(saved.filterStatus ?? "");

  // Persist table state to localStorage
  useEffect(() => {
    saveTableState({
      sortKey,
      sortDir,
      visibleCols: [...visibleCols],
      filterCourse,
      filterSection,
      filterPeriod,
      filterStatus,
    });
  }, [sortKey, sortDir, visibleCols, filterCourse, filterSection, filterPeriod, filterStatus]);

  // Dynamic filter options from data
  const courseOptions = [...new Set(enrollments.map((e) => e.courseName))].sort((a, b) => a.localeCompare(b, "cs"));
  const sectionOptions = [...new Set(enrollments.map((e) => e.courseSection))].filter((s) => s !== "—").sort((a, b) => a.localeCompare(b, "cs"));
  const periodOptions = [...new Set(enrollments.map((e) => {
    if (!e.termDate) return "";
    const d = new Date(e.termDate);
    if (isNaN(d.getTime())) return "";
    const q = Math.ceil((d.getMonth() + 1) / 3);
    return `Q${q} ${d.getFullYear()}`;
  }).filter(Boolean))].sort();
  const statusOptions = [...new Set(enrollments.map((e) => e.status))];

  const hasActiveFilters = filterCourse || filterSection || filterPeriod || filterStatus;

  function clearFilters() {
    setFilterCourse("");
    setFilterSection("");
    setFilterPeriod("");
    setFilterStatus("");
  }

  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const colDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterMenuOpen && filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
      if (colMenuOpen && colDropdownRef.current && !colDropdownRef.current.contains(e.target as Node)) {
        setColMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterMenuOpen, colMenuOpen]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  }, [checkScroll]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  useEffect(() => { checkScroll(); }, [visibleCols, checkScroll]);

  function toggleCol(key: SortKey) {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const filtered = enrollments.filter((e) => {
    if (filterCourse && e.courseName !== filterCourse) return false;
    if (filterSection && e.courseSection !== filterSection) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    if (filterPeriod) {
      const d = new Date(e.termDate);
      if (isNaN(d.getTime())) return false;
      const q = Math.ceil((d.getMonth() + 1) / 3);
      const label = `Q${q} ${d.getFullYear()}`;
      if (label !== filterPeriod) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = String(av).localeCompare(String(bv), "cs");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const columns = allColumns.filter((c) => visibleCols.has(c.key));

  function renderCell(enrollment: EnrichedEnrollment, key: SortKey) {
    switch (key) {
      case "userName":
        return <span className="font-medium text-foreground">{enrollment.userName}</span>;
      case "userEmail":
        return <span className="text-foreground">{enrollment.userEmail}</span>;
      case "courseName":
        return <span className="font-medium text-foreground">{enrollment.courseName}</span>;
      case "courseSection":
        return <Badge variant="brand" size="sm">{enrollment.courseSection}</Badge>;
      case "termDate":
        return safeFormatDate(enrollment.termDate);
      case "termLocation":
        return enrollment.termLocation || "—";
      case "enrolled_at":
        return safeFormatDate(enrollment.enrolled_at);
      case "status": {
        const cfg = statusConfig[enrollment.status as keyof typeof statusConfig];
        return cfg ? <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge> : enrollment.status;
      }
      default:
        return String(enrollment[key] ?? "—");
    }
  }

  return (
    <>
      <PageHeader
        fullWidth
        title="Administrace"
        description="Přehled všech přihlášek"
        imageUrl="/images/hero-team.jpg"
        className="-mt-6 mb-8"
      />

      {/* Wider content — breakout from max-w-7xl container */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-[family-name:var(--font-poppins)] font-bold text-lg">
          Všechny přihlášky
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({filtered.length}{filtered.length !== enrollments.length ? ` z ${enrollments.length}` : ""})
          </span>
        </h2>
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <div className="relative" ref={filterDropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1.5 ${hasActiveFilters ? 'text-brand-primary' : 'text-muted-foreground'}`}
              onClick={() => { setFilterMenuOpen((v) => !v); setColMenuOpen(false); }}
            >
              <Filter size={16} />
              Filtry
              {hasActiveFilters && (
                <span className="bg-brand-accent text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {[filterCourse, filterSection, filterPeriod, filterStatus].filter(Boolean).length}
                </span>
              )}
            </Button>
            {filterMenuOpen && (
              <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-auto sm:top-full mt-1 z-50 bg-card rounded-xl border border-border shadow-lg p-4 sm:min-w-[260px] space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kurz</label>
                    <select
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Všechny kurzy</option>
                      {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategorie</label>
                    <select
                      value={filterSection}
                      onChange={(e) => setFilterSection(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Všechny kategorie</option>
                      {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Období termínu</label>
                    <select
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Všechna období</option>
                      {periodOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Všechny statusy</option>
                      {statusOptions.map((s) => {
                        const cfg = statusConfig[s as keyof typeof statusConfig];
                        return <option key={s} value={s}>{cfg?.label || s}</option>;
                      })}
                    </select>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-sm text-brand-primary hover:opacity-80 transition-opacity pt-1 cursor-pointer"
                    >
                      <X size={14} />
                      Zrušit filtry
                    </button>
                  )}
                </div>
            )}
          </div>

          {/* Columns button */}
          <div className="relative" ref={colDropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-muted-foreground"
              onClick={() => { setColMenuOpen((v) => !v); setFilterMenuOpen(false); }}
            >
              <Settings2 size={16} />
              Sloupce
            </Button>
            {colMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-card rounded-xl border border-border shadow-lg p-2 min-w-[180px]">
                  {allColumns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-brand-light-hover transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols.has(col.key)}
                        onChange={() => toggleCol(col.key)}
                        className="rounded accent-[var(--color-scioedu-primary)]"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {filterCourse && (
            <FilterChip label={filterCourse} onRemove={() => setFilterCourse("")} />
          )}
          {filterSection && (
            <FilterChip label={filterSection} onRemove={() => setFilterSection("")} />
          )}
          {filterPeriod && (
            <FilterChip label={filterPeriod} onRemove={() => setFilterPeriod("")} />
          )}
          {filterStatus && (
            <FilterChip
              label={statusConfig[filterStatus as keyof typeof statusConfig]?.label || filterStatus}
              onRemove={() => setFilterStatus("")}
            />
          )}
          <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-brand-primary transition-colors ml-1 cursor-pointer">
            Zrušit vše
          </button>
        </div>
      )}

      <div className="relative">
      <Card ref={scrollRef} className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-brand-light-pale/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-brand-primary transition-colors select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wide text-right w-16">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="border-b border-border last:border-0 hover:bg-brand-light-pale/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-sm">
                      {renderCell(enrollment, col.key)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-sm text-right">
                    {enrollment.status === "enrolled" && (
                      <button
                        onClick={() => setCancelTarget(enrollment)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Odhlásit z kurzu"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {hasActiveFilters ? (
                        <>
                          <Filter size={32} className="text-muted-foreground/40" />
                          <p className="text-muted-foreground font-medium">Žádné přihlášky neodpovídají filtru</p>
                          <button
                            onClick={clearFilters}
                            className="text-sm text-brand-primary hover:opacity-80 transition-opacity mt-1 cursor-pointer"
                          >
                            Zrušit filtry
                          </button>
                        </>
                      ) : (
                        <>
                          <ChevronsUpDown size={32} className="text-muted-foreground/40" />
                          <p className="text-muted-foreground font-medium">Zatím nejsou žádné přihlášky</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </Card>
      {/* Scroll indicators */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none rounded-l-2xl flex items-center justify-start pl-2 transition-opacity" style={{ background: 'linear-gradient(to right, var(--color-scioedu-light), transparent)' }}>
          <span className="text-brand-primary text-lg">‹</span>
        </div>
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none rounded-r-2xl flex items-center justify-end pr-2 transition-opacity" style={{ background: 'linear-gradient(to left, var(--color-scioedu-light), transparent)' }}>
          <span className="text-brand-primary text-lg">›</span>
        </div>
      )}
      </div>
      </div>

      {/* Cancel enrollment dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={(open) => { if (!open) setCancelTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Odhlásit z kurzu</DialogTitle>
            <DialogDescription>
              Opravdu chcete odhlásit <strong>{cancelTarget?.userName}</strong> z kurzu{" "}
              <strong>{cancelTarget?.courseName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Zrušit</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (!cancelTarget) return;
                fetcher.submit(
                  { intent: "admin-cancel", enrollmentId: cancelTarget.id },
                  { method: "post" }
                );
                setCancelTarget(null);
              }}
            >
              Odhlásit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
