export interface Person {
  name: string;
  role: string;
  email: string;
  company: string;
  isExternal: boolean;
}

export const people: Person[] = [
  {
    name: 'Arjun Malhotra',
    role: 'VP Sales (the agent\'s user)',
    email: 'arjun.malhotra@veridian-corp.example',
    company: 'Veridian Corp',
    isExternal: false,
  },
  {
    name: 'Neha Kapoor',
    role: 'Marketing Lead',
    email: 'neha.kapoor@veridian-corp.example',
    company: 'Veridian Corp',
    isExternal: false,
  },
  {
    name: 'Raghav Sethi',
    role: 'Ops Manager',
    email: 'raghav.sethi@veridian-corp.example',
    company: 'Veridian Corp',
    isExternal: false,
  },
  {
    name: 'Divya Rao',
    role: 'Finance',
    email: 'divya.rao@veridian-corp.example',
    company: 'Veridian Corp',
    isExternal: false,
  },
  {
    name: 'Priya Nair',
    role: 'Meridian Logistics (external client)',
    email: 'priya.nair@meridianlogistics.example',
    company: 'Meridian Logistics',
    isExternal: true,
  },
  {
    name: 'Facilities',
    role: 'Internal distribution list',
    email: 'facilities@veridian-corp.example',
    company: 'Veridian Corp',
    isExternal: false,
  },
];

export function getPersonByEmail(email: string): Person | undefined {
  return people.find(p => p.email === email);
}

export function getPersonName(email: string): string {
  const person = getPersonByEmail(email);
  return person ? person.name : email;
}
