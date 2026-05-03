import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { AppLoadContext } from "@remix-run/cloudflare";
import type { TypedObject } from "@portabletext/types";

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

/** PortableText block content — array of typed Sanity blocks, rendered via @portabletext/react */
export type PortableTextValue = TypedObject[];

/** Sanity image asset reference — opaque, processed via getImageUrlBuilder() */
export type SanityImage = unknown;

export type Course = {
  _id: string;
  title: string;
  slug: { current: string };
  highlight?: PortableTextValue;
  description?: PortableTextValue;
  target_audience?: PortableTextValue;
  how_it_works?: PortableTextValue;
  benefits?: string[];
  section: string;
  subsection?: string;
  tags?: string[];
  status?: "open" | "preparing";
  dates?: Array<{
    date_start?: string;
    date_start_text?: string;
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
    photo?: SanityImage;
    bio?: string;
    email?: string;
  }>;
  contact_name?: string;
  contact_email?: string;
  image?: SanityImage;
  materials?: Array<{
    label: string;
    url: string;
  }>;
  gallery?: Array<{
    _key: string;
    alt?: string;
    asset?: {
      _id: string;
      metadata?: { dimensions?: { width: number; height: number } };
    };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  }>;
  testimonials?: string[];
  external_url?: string;
  is_published: boolean;
  is_external: boolean;
};

export type Lecturer = {
  _id: string;
  name: string;
  slug: { current: string };
  photo?: SanityImage;
  bio?: string;
  email?: string;
};

export type SectionPage = {
  _id: string;
  title: string;
  slug: { current: string };
  intro_text?: PortableTextValue;
  section_key: string;
  resources?: Array<{
    label: string;
    url: string;
    type: string;
  }>;
  is_visible: boolean;
  order: number;
};
