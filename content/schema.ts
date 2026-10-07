/**
 * Content model for the universe. Everything rendered on the site comes from
 * typed data under `content/`; visuals (planet looks, orbits) are derived from
 * slugs at runtime and never stored here.
 */

export type YearMonth = `${number}-${number}`;
export type ISODate = `${number}-${number}-${number}` | YearMonth;

export type PlanetStatus = "live" | "done" | "prototype" | "ongoing" | "superseded";
export type Domain = "genai" | "data" | "cloud" | "cv" | "web" | "ops";
export type PlanetSize = "small" | "medium" | "large";
export type SystemKind = "rich" | "dim";

export interface Link {
  label: string;
  url: string;
}

export interface Certification {
  name: string;
  issuer: string;
  period: string;
  url: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Profile {
  name: string;
  fullName: string;
  headline: string;
  /** Paragraphs, already written for a public audience. */
  summary: string[];
  location: string;
  timezone: string;
  photo: { src: string; alt: string; width: number; height: number };
  links: { github: string; linkedin: string; email: string; twitter?: string };
  skills: SkillGroup[];
  certifications: Certification[];
  education: { degree: string; school: string; year: string };
  languages: string[];
  /** Headline numbers shown on the ship HUD. */
  stats: { label: string; value: string }[];
}

export interface Role {
  title: string;
  start: YearMonth;
  end?: YearMonth;
}

export interface TimelineImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface TimelineEntry {
  date: ISODate;
  title: string;
  detail?: string;
  image?: TimelineImage;
}

export interface Moon {
  slug: string;
  name: string;
  summary: string;
  start?: ISODate;
  end?: ISODate;
  tech?: string[];
}

export interface Metric {
  label: string;
  value: string;
}

export interface Planet {
  slug: string;
  name: string;
  /** Mission code shown in the HUD, e.g. "TDW-16". */
  codename: string;
  start: ISODate;
  end?: ISODate;
  status: PlanetStatus;
  domain: Domain;
  size: PlanetSize;
  flagship?: boolean;
  /** Anonymized sector label for the client, e.g. "a regional food manufacturer". */
  clientLabel?: string;
  summary: string;
  problem: string;
  /** What Saúl personally did, in honest verbs. */
  role: string;
  outcome: string[];
  metrics: Metric[];
  tech: string[];
  moons?: Moon[];
  timeline: TimelineEntry[];
  links?: Link[];
  /** Generated gas giants of dim systems: partial records reconstructed from CV bullets. */
  fragmentary?: boolean;
  /** Where the facts came from. Never rendered. */
  sources?: string[];
}

export interface System {
  slug: string;
  name: string;
  kind: SystemKind;
  roles: Role[];
  location: string;
  summary: string;
  /** Dim systems: each bullet becomes a gas giant. */
  bullets?: { title: string; text: string; tech?: string[] }[];
  planets: Planet[];
  /** Position of the star in galaxy space. */
  galaxyPosition: [number, number, number];
}

export interface Universe {
  profile: Profile;
  systems: System[];
  /** Default visual seed; `?seed=` and the shuffle control override it. */
  defaultSeed: number;
}
