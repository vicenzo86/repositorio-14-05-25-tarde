import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// Supondo que os componentes Select e Button sejam importados de shadcn/ui ou similar
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

const FilterPage: React.FC = () => {
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevenir o comportamento padrão do formulário
    // Aqui, futuramente, você adicionaria a lógica para coletar os dados do filtro
    // e passá-los para a página do mapa, talvez via estado global, query params, etc.
    console.log('Filtros aplicados (lógica a ser implementada)');
    navigate('/'); // Redirecionar para a página do mapa (Index)
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Filtrar Licenças Ambientais</h1>
        <p className="text-gray-600">Selecione os critérios abaixo para encontrar as licenças desejadas.</p>
      </header>

      <main className="max-w-2xl mx-auto bg-white p-6 md:p-8 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}> {/* Adicionar onSubmit ao formulário */}
          <div className="mb-6">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            {/* Substituir pelo componente Select do shadcn/ui */}
            <select
              id="city"
              name="city"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecione uma cidade</option>
              {/* Opções de cidade seriam carregadas aqui */}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="emissionYear" className="block text-sm font-medium text-gray-700 mb-1">Ano de Emissão</label>
            {/* Substituir pelo componente Select do shadcn/ui */}
            <select
              id="emissionYear"
              name="emissionYear"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecione um ano</option>
              {/* Opções de ano seriam carregadas aqui */}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Licença (Status)</label>
            {/* Substituir pelo componente Select do shadcn/ui */}
            <select
              id="licenseType"
              name="licenseType"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecione um status</option>
              {/* Opções de tipo de licença seriam carregadas aqui */}
            </select>
          </div>

          <div className="mt-8">
            {/* Substituir pelo componente Button do shadcn/ui */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aplicar Filtros e Ver Resultados
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FilterPage;

