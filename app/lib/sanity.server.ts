import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { AppLoadContext } from "@remix-run/cloudflare";

export function createSanityClient(context: AppLoadContext) {
  return createClient({
    projectId: context.env.SANITY_PROJECT_ID,
    dataset: context.env.SANITY_DATASET || "production",
    apiVersion: context.env.SANITY_API_VERSION || "2024-01-01",
    useCdn: true,
  });
}

export function getImageUrlBuilder(context: AppLoadContext) {
  const client = createSanityClient(context);
  return imageUrlBuilder(client);
}

export type Course = {
  _id: string;
  title: string;
  slug: { current: string };
  highlight?: string;
  description?: any[];
  target_audience?: string;
  benefits?: string[];
  section: string;
  subsection?: string;
  tags?: string[];
  dates?: Array<{
    date_start: string;
    date_end: string;
    location: string;
    capacity: number;
    note?: string;
  }>;
  duration_minutes?: number;
  price?: number;
  lecturers?: Array<{
    _id: string;
    name: string;
    photo?: any;
    bio?: string;
    email?: string;
  }>;
  contact_name?: string;
  contact_email?: string;
  image?: any;
  materials?: Array<{
    label: string;
    url: string;
  }>;
  external_url?: string;
  is_published: boolean;
  is_external: boolean;
};

export type Lecturer = {
  _id: string;
  name: string;
  slug: { current: string };
  photo?: any;
  bio?: string;
  email?: string;
};

export type SectionPage = {
  _id: string;
  title: string;
  slug: { current: string };
  intro_text?: any[];
  section_key: string;
  resources?: Array<{
    label: string;
    url: string;
    type: string;
  }>;
  is_visible: boolean;
  order: number;
};
