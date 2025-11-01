// Données mockées pour la démo - Gestion locative

export const mockProperties = [
  {
    id: 1,
    name: 'Appartement T2 - Paris 15e',
    address: '45 Rue de Vaugirard, 75015 Paris',
    city: 'Paris',
    status: 'occupied',
    rent: 950,
    tenant: {
      name: 'Marie Dubois',
      entryDate: '2023-06-01',
      exitDate: null,
      rent: 950,
      status: 'on_time'
    },
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
  },
  {
    id: 2,
    name: 'Studio - Lyon 3e',
    address: '12 Avenue Foch, 69003 Lyon',
    city: 'Lyon',
    status: 'vacant',
    rent: 650,
    tenant: null,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'
  },
  {
    id: 3,
    name: 'T3 - Marseille 13e',
    address: '8 Boulevard Michelet, 13013 Marseille',
    city: 'Marseille',
    status: 'occupied',
    rent: 1200,
    tenant: {
      name: 'Jean Martin',
      entryDate: '2022-09-15',
      exitDate: null,
      rent: 1200,
      status: 'late'
    },
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
  },
  {
    id: 4,
    name: 'T2 - Bordeaux Centre',
    address: '23 Rue Sainte-Catherine, 33000 Bordeaux',
    city: 'Bordeaux',
    status: 'occupied',
    rent: 850,
    tenant: {
      name: 'Sophie Laurent',
      entryDate: '2024-01-10',
      exitDate: null,
      rent: 850,
      status: 'on_time'
    },
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'
  }
]

export const mockPayments = [
  {
    id: 1,
    propertyId: 1,
    property: 'Appartement T2 - Paris 15e',
    tenant: 'Marie Dubois',
    amount: 950,
    dueDate: '2024-12-05',
    status: 'paid'
  },
  {
    id: 2,
    propertyId: 3,
    property: 'T3 - Marseille 13e',
    tenant: 'Jean Martin',
    amount: 1200,
    dueDate: '2024-11-05',
    status: 'late'
  },
  {
    id: 3,
    propertyId: 4,
    property: 'T2 - Bordeaux Centre',
    tenant: 'Sophie Laurent',
    amount: 850,
    dueDate: '2024-12-10',
    status: 'pending'
  }
]

export const mockGlobalStats = {
  totalProperties: 4,
  occupiedProperties: 3,
  vacantProperties: 1,
  totalRent: 3650,
  latePayments: 1
}

export const mockTestimonials = [
  {
    name: 'Sophie Laurent',
    role: 'Propriétaire',
    text: 'Doogoo m\'a permis de réduire mes visites de 80%. Je surveille tout depuis mon téléphone.',
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

