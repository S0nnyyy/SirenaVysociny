// data/statistics.ts

import { EmergencyCall } from '@/types/emergency'; // Assuming this type definition exists

export const EMERGENCY_CALLS: EmergencyCall[] = [
  {
    id: '1',
    title: 'Požár rodinného domu',
    description: 'Požár střechy rodinného domu. Na místě zasahují 3 jednotky. Probíhá evakuace obyvatel.',
    location: 'Masarykova 123, Jihlava',
    coordinates: {
      latitude: 49.3961,
      longitude: 15.5903,
    },
    type: 'fire',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minut zpět
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minut zpět
    units: ['Stanice Jihlava - CAS 20', 'Stanice Jihlava - AZ 30', 'Stanice Polná - CAS 15'],
    priority: 1,
    region: 'Kraj Vysočina',
    district: 'Jihlava',
    station: 'Stanice Jihlava',
  },
  {
    id: '2',
    title: 'Dopravní nehoda',
    description: 'Dopravní nehoda dvou osobních vozidel. Jedna osoba zaklíněna ve vozidle. Na místě ZZS.',
    location: 'Silnice I/38, km 112, směr Havlíčkův Brod',
    coordinates: {
      latitude: 49.4428,
      longitude: 15.6603,
    },
    type: 'accident',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minut zpět
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minut zpět
    units: ['Stanice Jihlava - CAS 20', 'Stanice Jihlava - RZA', 'Stanice Havlíčkův Brod - CAS 15'],
    priority: 1,
    region: 'Kraj Vysočina',
    district: 'Jihlava',
    station: 'Stanice Jihlava',
  },
  {
    id: '3',
    title: 'Únik nebezpečné látky',
    description: 'Únik neznámé látky do potoka. Na místě zjištěn úhyn ryb. Probíhá ohraničení a identifikace látky.',
    location: 'Potok Bělá, Pelhřimov',
    coordinates: {
      latitude: 49.4311,
      longitude: 15.2233,
    },
    type: 'chemical',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minut zpět
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minut zpět
    units: ['Stanice Pelhřimov - CAS 20', 'Stanice Pelhřimov - TACH'],
    priority: 2,
    region: 'Kraj Vysočina',
    district: 'Pelhřimov',
    station: 'Stanice Pelhřimov',
  },
  {
    id: '4',
    title: 'Technická pomoc - strom',
    description: 'Spadlý strom na komunikaci. Blokuje oba jízdní pruhy. Bez zranění osob.',
    location: 'Silnice II/602, Velké Meziříčí',
    coordinates: {
      latitude: 49.3553,
      longitude: 16.0121,
    },
    type: 'technical',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hodiny zpět
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hodina zpět
    units: ['Stanice Velké Meziříčí - CAS 15'],
    priority: 3,
    region: 'Kraj Vysočina',
    district: 'Žďár nad Sázavou',
    station: 'Stanice Velké Meziříčí',
  },
  {
    id: '5',
    title: 'Požár lesa',
    description: 'Požár lesního porostu na ploše cca 1 ha. Obtížný terén, probíhá dálková doprava vody.',
    location: 'Les u obce Věžnice',
    coordinates: {
      latitude: 49.5121,
      longitude: 15.7234,
    },
    type: 'fire',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hodiny zpět
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minut zpět
    units: ['Stanice Havlíčkův Brod - CAS 30', 'Stanice Havlíčkův Brod - CAS 20', 'Stanice Chotěboř - CAS 15', 'Stanice Jihlava - VEA'],
    priority: 1,
    region: 'Kraj Vysočina',
    district: 'Havlíčkův Brod',
    station: 'Stanice Havlíčkův Brod',
  },
  {
    id: '6',
    title: 'Záchrana osoby z vody',
    description: 'Tonoucí osoba v přehradě. Na místě probíhá záchrana pomocí člunu.',
    location: 'Vodní nádrž Dalešice, Koněšín',
    coordinates: {
      latitude: 49.1342,
      longitude: 16.1121,
    },
    type: 'rescue',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minut zpět
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minut zpět
    units: ['Stanice Třebíč - CAS 20', 'Stanice Třebíč - člun', 'Stanice Náměšť nad Oslavou - CAS 15'],
    priority: 1,
    region: 'Kraj Vysočina',
    district: 'Třebíč',
    station: 'Stanice Třebíč',
  }
];