// Données mockées pour la démo

export const mockProperties = [
  {
    id: 1,
    name: 'Appartement T2 - Paris 15e',
    address: '45 Rue de Vaugirard, 75015 Paris',
    status: 'occupied',
    temperature: 21.5,
    humidity: 45,
    airQuality: 'Bon',
    energyConsumption: 125,
    alerts: 2,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
  },
  {
    id: 2,
    name: 'Studio - Lyon 3e',
    address: '12 Avenue Foch, 69003 Lyon',
    status: 'vacant',
    temperature: 18.2,
    humidity: 38,
    airQuality: 'Excellent',
    energyConsumption: 45,
    alerts: 0,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'
  },
  {
    id: 3,
    name: 'T3 - Marseille 13e',
    address: '8 Boulevard Michelet, 13013 Marseille',
    status: 'occupied',
    temperature: 23.1,
    humidity: 52,
    airQuality: 'Moyen',
    energyConsumption: 198,
    alerts: 1,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
  }
]

export const mockPayments = [
  {
    id: 1,
    property: 'Appartement T2 - Paris 15e',
    tenant: 'Marie Dubois',
    amount: 850,
    dueDate: '2024-12-05',
    status: 'pending'
  },
  {
    id: 2,
    property: 'T3 - Marseille 13e',
    tenant: 'Jean Martin',
    amount: 1200,
    dueDate: '2024-12-10',
    status: 'pending'
  }
]

export const mockGlobalStats = {
  averageTemp: 21.3,
  averageHumidity: 45,
  airQuality: 'Bon',
  totalEnergy: 368,
  totalProperties: 3,
  occupiedProperties: 2,
  vacantProperties: 1,
  totalAlerts: 3
}

export const mockTestimonials = [
  {
    name: 'Sophie Laurent',
    role: 'Propriétaire',
    text: 'MyBI m\'a permis de réduire mes visites de 80%. Je surveille tout depuis mon téléphone.',
    avatar: 'https://i.pravatar.cc/150?img=47'
  },
  {
    name: 'Pierre Moreau',
    role: 'Gestionnaire immobilier',
    text: 'Une interface intuitive et des alertes fiables. Mes clients adorent la transparence.',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    name: 'Isabelle Chen',
    role: 'Investisseur',
    text: 'Le suivi en temps réel de la consommation énergétique m\'aide à optimiser mes coûts.',
    avatar: 'https://i.pravatar.cc/150?img=33'
  }
]

