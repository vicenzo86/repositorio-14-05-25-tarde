
import { useState, useEffect, useCallback, useMemo, useRef, useTransition } from 'react';
import { fetchConstructions, filterConstructions } from '../data/supabaseService';
import { Construction } from '../types/Construction';
import Map from '../components/Map';
import { Filter } from '../types/Filter';
import { Category } from '../types/Category';

// Hook de debounce personalizado
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Componente de cartão de construção memoizado
const ConstructionCard = React.memo(({ construction }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold">{construction.name}</h3>
      <p className="text-gray-600">{construction.address}</p>
      <p className="text-gray-600">{construction.category}</p>
    </div>
  );
});

const Index = () => {
  const [constructions, setConstructions] = useState([]);
  const [displayedConstructions, setDisplayedConstructions] = useState([]);
  const lastDisplayedConstructionsRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('map');
  const [filter, setFilter] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Debounce dos valores de filtro
  const debouncedFilter = useDebounce(filter, 300);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedCategory = useDebounce(selectedCategory, 300);

  // Memoize a lista de categorias
  const categories = useMemo(() => {
    const uniqueCategories = new Set(constructions.map(c => c.category));
    return Array.from(uniqueCategories);
  }, [constructions]);

  // Buscar construções apenas uma vez na montagem do componente
  useEffect(() => {
    const loadConstructions = async () => {
      try {
        setLoading(true);
        const data = await fetchConstructions();
        setConstructions(data || []);
        setDisplayedConstructions(data || []);
        lastDisplayedConstructionsRef.current = data || [];
      } catch (error) {
        console.error('Erro ao carregar construções:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConstructions();
  }, []);

  // Aplicar filtros com debounce
  useEffect(() => {
    const applyFilters = async () => {
      // Evitar atualizações desnecessárias
      if (
        Object.keys(debouncedFilter).length === 0 &&
        debouncedSearchQuery === '' &&
        debouncedCategory === '' &&
        constructions.length > 0
      ) {
        // Se não há filtros ativos, use todas as construções
        if (JSON.stringify(lastDisplayedConstructionsRef.current) !== JSON.stringify(constructions)) {
          startTransition(() => {
            setDisplayedConstructions(constructions);
            lastDisplayedConstructionsRef.current = constructions;
          });
        }
        return;
      }

      try {
        setLoading(true);
        const filtered = await filterConstructions(constructions, debouncedFilter, debouncedSearchQuery, debouncedCategory);
        
        // Evitar atualizações de estado desnecessárias
        if (JSON.stringify(lastDisplayedConstructionsRef.current) !== JSON.stringify(filtered)) {
          startTransition(() => {
            setDisplayedConstructions(filtered);
            lastDisplayedConstructionsRef.current = filtered;
          });
        }
      } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [debouncedFilter, debouncedSearchQuery, debouncedCategory, constructions]);

  // Handlers memoizados
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(prev => {
      // Evitar atualizações desnecessárias
      if (JSON.stringify(prev) === JSON.stringify(newFilter)) return prev;
      return newFilter;
    });
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Renderização condicional otimizada
  const renderContent = useMemo(() => {
    if (loading || isPending) {
      return <div className="flex justify-center items-center h-64">Carregando...</div>;
    }

    if (activeTab === 'map') {
      return <Map constructions={displayedConstructions} />;
    } else {
      return (
        <div className="grid grid-cols-1 gap-4">
          {displayedConstructions.length > 0 ? (
            displayedConstructions.map(construction => (
              <ConstructionCard key={construction.id} construction={construction} />
            ))
          ) : (
            <div className="text-center py-8">Nenhuma construção encontrada.</div>
          )}
        </div>
      );
    }
  }, [activeTab, displayedConstructions, loading, isPending]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 mr-2 ${activeTab === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleTabChange('map')}
          >
            Mapa
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleTabChange('list')}
          >
            Lista
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar construções..."
            className="border p-2 rounded flex-grow"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            className="border p-2 rounded"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {renderContent}
    </div>
  );
};

export default React.memo(Index);
