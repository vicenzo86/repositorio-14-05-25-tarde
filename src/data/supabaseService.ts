
import { supabase } from './supabaseClient';
import { Construction } from '../types/Construction';
import { Filter } from '../types/Filter';

// Sistema de cache
interface CacheItem {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheItem> = {};
const CACHE_TTL = 60000; // 1 minuto em milissegundos

// Função para gerar chave de cache
const generateCacheKey = (endpoint: string, params?: any): string => {
  return `${endpoint}:${params ? JSON.stringify(params) : ''}`;
};

// Função para obter dados do cache ou da API
const getCachedData = async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  const cachedItem = cache[key];

  if (cachedItem && now - cachedItem.timestamp < CACHE_TTL) {
    return cachedItem.data;
  }

  const data = await fetchFn();
  cache[key] = { data, timestamp: now };
  return data;
};

// Função para limitar a frequência de chamadas (throttle)
const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let lastCall = 0;
  let lastResult: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    const now = Date.now();
    if (now - lastCall < limit) {
      return lastResult;
    }
    lastCall = now;
    lastResult = func(...args);
    return lastResult;
  }) as T;
};

// Buscar todas as construções
export const fetchConstructions = async (): Promise<Construction[]> => {
  const cacheKey = generateCacheKey('constructions');

  return getCachedData(cacheKey, async () => {
    try {
      const { data, error } = await supabase
        .from('constructions')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar construções:', error);
      return [];
    }
  });
};

// Filtrar construções (com throttle)
export const filterConstructions = throttle(
  async (
    constructions: Construction[],
    filter: Filter,
    searchQuery: string,
    category: string
  ): Promise<Construction[]> => {
    // Se não há filtros ativos, retorne todas as construções
    if (
      Object.keys(filter).length === 0 &&
      !searchQuery &&
      !category &&
      constructions.length > 0
    ) {
      return constructions;
    }

    try {
      // Aplicar filtros localmente para evitar chamadas desnecessárias à API
      let filtered = [...constructions];

      // Aplicar filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (construction) =>
            construction.name.toLowerCase().includes(query) ||
            construction.address.toLowerCase().includes(query)
        );
      }

      // Aplicar filtro de categoria
      if (category) {
        filtered = filtered.filter((construction) => construction.category === category);
      }

      // Aplicar outros filtros
      if (Object.keys(filter).length > 0) {
        // Implemente a lógica de filtro adicional aqui
      }

      return filtered;
    } catch (error) {
      console.error('Erro ao filtrar construções:', error);
      return [];
    }
  },
  300 // Limitar a 1 chamada a cada 300ms
);
