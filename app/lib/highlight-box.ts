export type HighlightBoxVariant = "accent" | "primary";

type ButtonLink =
  | {
      linkType: "course";
      label: string;
      course: { slug: string } | null;
      section?: null;
      url?: null;
    }
  | {
      linkType: "section";
      label: string;
      section: { section_key: string } | null;
      course?: null;
      url?: null;
    }
  | {
      linkType: "url";
      label: string;
      url: string | null;
      course?: null;
      section?: null;
    };

export type HighlightBoxDoc = {
  _id: string;
  title?: string;
  heading: string;
  description?: string;
  variant?: HighlightBoxVariant;
  button: ButtonLink;
};

export const HIGHLIGHT_BOXES_PROJECTION = `highlight_boxes[]->{
  _id,
  title,
  heading,
  description,
  variant,
  button{
    label,
    linkType,
    "course": course->{ "slug": slug.current },
    "section": section->{ section_key },
    url
  }
}`;

export function resolveButtonHref(button: HighlightBoxDoc["button"]): string {
  if (button.linkType === "course" && button.course?.slug) {
    return `/programy/kurz/${button.course.slug}`;
  }
  if (button.linkType === "section" && button.section?.section_key) {
    return `/programy/${button.section.section_key}`;
  }
  if (button.linkType === "url" && button.url) {
    return button.url;
  }
  return "#";
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
