import rawData from './static/salaries.json';

export interface Worker {
  gender: string;
  education: number;
  experience: number;
  workPlace: string;
  jobType: string;
  subject: string;
  salary: number;
  hasBonus: boolean;
  hasProvision: boolean;
}

export interface RawWorker {
  kjønn: string;
  'års utdanning': number;
  'års erfaring': number;
  arbeidssted: string;
  jobbtype: string;
  fag: string;
  lønn: number;
  'inkludert bonus?': boolean;
  'inkludert provisjon?': boolean;
}

export const workerStats: Worker[] = (rawData as RawWorker[]).map((entry) => ({
  gender: entry.kjønn,
  education: entry['års utdanning'],
  experience: entry['års erfaring'],
  workPlace: entry.arbeidssted,
  jobType: entry.jobbtype,
  subject: entry.fag,
  salary: entry.lønn,
  hasBonus: entry['inkludert bonus?'],
  hasProvision: entry['inkludert provisjon?'],
}));
