export type BranchProfile = {
  name: string;
  slug: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  gallery: string[];
  description: string;
  managerName: string;
  chefNames: string[];
  waiterNames: string[];
};

export const branchProfiles: BranchProfile[] = [
  {
    name: "Mayfair Prime Steakhouse",
    slug: "mayfair-prime",
    area: "Mayfair",
    address: "18 Berkeley Street, Mayfair, London W1J 8NF",
    phone: "020 7946 1010",
    hours: "Mon-Thu 12:00-23:00, Fri-Sat 12:00-00:30, Sun 12:00-22:00",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=900&q=80",
    ],
    description: "Flagship dining room with dry-aged prime cuts, polished service, and a cellar-led evening menu.",
    managerName: "Amelia Hart",
    chefNames: ["Luca Bennett", "Nadia Cole"],
    waiterNames: ["Maya King", "Oscar Reed"],
  },
  {
    name: "Soho Flame Grill",
    slug: "soho-flame",
    area: "Soho",
    address: "42 Dean Street, Soho, London W1D 4PY",
    phone: "020 7946 2020",
    hours: "Mon-Thu 12:00-23:30, Fri-Sat 12:00-01:00, Sun 12:00-22:30",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=900&q=80",
    ],
    description: "A lively grill room built around open-flame steaks, late dinners, cocktails, and pre-theatre tables.",
    managerName: "Ethan Brooks",
    chefNames: ["Marco Silva", "Priya Shah"],
    waiterNames: ["Noah Ellis", "Ruby Foster"],
  },
  {
    name: "Kensington Steak Room",
    slug: "kensington-steak-room",
    area: "Kensington",
    address: "77 Kensington High Street, London W8 5NP",
    phone: "020 7946 3030",
    hours: "Mon-Thu 12:00-22:30, Fri-Sat 12:00-00:00, Sun 12:00-21:30",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
    ],
    description: "Elegant neighbourhood steak room serving classic fillet, ribeye, sides, desserts, and family bookings.",
    managerName: "Clara Hughes",
    chefNames: ["Jonas Miles", "Hannah Price"],
    waiterNames: ["Leo Scott", "Iris Turner"],
  },
  {
    name: "Canary Wharf Grill House",
    slug: "canary-wharf-grill-house",
    area: "Canary Wharf",
    address: "9 Westferry Circus, Canary Wharf, London E14 4HD",
    phone: "020 7946 4040",
    hours: "Mon-Fri 11:30-23:30, Sat 12:00-00:00, Sun 12:00-22:00",
    image: "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=900&q=80",
    ],
    description: "Modern riverside grill house for business lunches, premium steaks, sparkling drinks, and fast service.",
    managerName: "Daniel Morgan",
    chefNames: ["Sofia Evans", "Callum Ward"],
    waiterNames: ["Grace Bell", "Theo Hayes"],
  },
  {
    name: "Covent Garden Steakhouse",
    slug: "covent-garden-steakhouse",
    area: "Covent Garden",
    address: "24 Henrietta Street, Covent Garden, London WC2E 8ND",
    phone: "020 7946 5050",
    hours: "Mon-Thu 12:00-23:00, Fri-Sat 12:00-00:30, Sun 12:00-22:00",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1564758866811-4780aa0a7162?auto=format&fit=crop&w=900&q=80",
    ],
    description: "Theatre district steakhouse with a broad menu, generous sides, desserts, and polished table service.",
    managerName: "Isabelle Grant",
    chefNames: ["Rafael Cooper", "Elena Wood"],
    waiterNames: ["Freya Morris", "Arthur Lane"],
  },
];

export const londonBranches = branchProfiles.map((branch) => branch.name);
export const defaultBranch = londonBranches[0];

export function findBranchBySlug(slug: string) {
  return branchProfiles.find((branch) => branch.slug === slug);
}

export function findBranchByName(name?: string | null) {
  return branchProfiles.find((branch) => branch.name === name);
}

export const branchAccounts = branchProfiles.map((branch) => {
  const accountMap: Record<string, { emailSlug: string; passwordPrefix: string }> = {
    "mayfair-prime": { emailSlug: "mayfair", passwordPrefix: "Mayfair" },
    "soho-flame": { emailSlug: "soho", passwordPrefix: "Soho" },
    "kensington-steak-room": { emailSlug: "kensington", passwordPrefix: "Kensington" },
    "canary-wharf-grill-house": { emailSlug: "canary", passwordPrefix: "Canary" },
    "covent-garden-steakhouse": { emailSlug: "covent", passwordPrefix: "Covent" },
  };
  const { emailSlug, passwordPrefix } = accountMap[branch.slug];

  return {
    branch: branch.name,
    managerEmail: `manager.${emailSlug}@steakz.com`,
    managerPassword: `${passwordPrefix}Manager123`,
    managerName: branch.managerName,
    chefs: branch.chefNames.map((name, index) => ({
      email: `chef${index + 1}.${emailSlug}@steakz.com`,
      password: `${passwordPrefix}Chef${index + 1}123`,
      name,
    })),
    waiters: branch.waiterNames.map((name, index) => ({
      email: `waiter${index + 1}.${emailSlug}@steakz.com`,
      password: `${passwordPrefix}Waiter${index + 1}123`,
      name,
    })),
  };
});
