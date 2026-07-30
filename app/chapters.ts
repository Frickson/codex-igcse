export type Chapter = {
  n: number;
  /** Route segment relative to the site root. "" = the home page ("/"). */
  path: string;
  title: string;
  blurb: string;
};

// Ordered list of chapters — the single source of truth for both the
// /chapters/ directory page and the prev/next chapter navigation.
// To add a chapter, append an entry here and create its app/chapter-N/ route.
export const CHAPTERS: Chapter[] = [
  { n: 1, path: "chapter-1", title: "Motion, forces & energy", blurb: "Measurement and vectors, motion graphs, mass, weight and density, forces, moments, momentum, energy, work, power and pressure." },
  { n: 2, path: "chapter-2", title: "Thermal physics", blurb: "Kinetic particle model, gases and absolute temperature, thermal expansion, specific heat, phase change, and transfer by conduction, convection and radiation." },
  { n: 3, path: "chapter-3", title: "Waves", blurb: "Wave properties and v = fλ, reflection, refraction and total internal reflection, converging lenses, dispersion, the electromagnetic spectrum and sound." },
  { n: 4, path: "", title: "Electricity & magnetism", blurb: "Magnetism, electrical quantities, circuits, electrical safety and electromagnetic effects." },
  { n: 5, path: "chapter-5", title: "Nuclear physics", blurb: "The nuclear model of the atom, radioactivity, decay and half-life, uses and safety." },
  { n: 6, path: "chapter-6", title: "Space physics", blurb: "Earth and the Solar System, orbital motion and gravity, stars, redshift, Hubble and the expanding Universe." },
];
