export type Profile = {
  id: string;
  full_name: string;
  department?: string;
  school?: string;
  avatar_url?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  term_index: number;
  enrolled_at: string;
  status: "enrolled" | "completed" | "cancelled";
};

export type EnrollmentWithProfile = Enrollment & {
  profile: Profile;
};

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  htmlLink: string;
  colorId?: string;
  status?: string;
}
