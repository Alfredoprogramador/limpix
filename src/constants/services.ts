import { ServiceCategory } from '../types';

export interface ServiceInfo {
  key: ServiceCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    key: 'limpeza',
    label: 'Limpeza',
    icon: '🧹',
    color: '#42A5F5',
    description: 'Limpeza residencial e comercial, faxina, higienização',
  },
  {
    key: 'pintura',
    label: 'Pintura',
    icon: '🎨',
    color: '#EF5350',
    description: 'Pintura de paredes, tetos, fachadas e móveis',
  },
  {
    key: 'pedreiro',
    label: 'Pedreiro',
    icon: '🧱',
    color: '#FF7043',
    description: 'Alvenaria, reforma, construção e reparos em geral',
  },
  {
    key: 'encanador',
    label: 'Encanador',
    icon: '🔧',
    color: '#26A69A',
    description: 'Instalação e reparo de encanamentos, vazamentos e infiltrações',
  },
  {
    key: 'eletricista',
    label: 'Eletricista',
    icon: '⚡',
    color: '#FFA726',
    description: 'Instalações elétricas, troca de disjuntores, tomadas e iluminação',
  },
  {
    key: 'estofado',
    label: 'Estofado',
    icon: '🛋️',
    color: '#AB47BC',
    description: 'Higienização e reforma de sofás, colchões, cadeiras e estofados',
  },
];

export const SERVICE_MAP: Record<ServiceCategory, ServiceInfo> = Object.fromEntries(
  SERVICES.map(s => [s.key, s])
) as Record<ServiceCategory, ServiceInfo>;

export const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const STATUS_COLORS: Record<string, string> = {
  pendente: '#FFA726',
  confirmado: '#42A5F5',
  concluido: '#66BB6A',
  cancelado: '#EF5350',
};
