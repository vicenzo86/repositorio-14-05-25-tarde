import React from 'react';

// Supondo que ícones sejam importados de uma biblioteca como react-icons ou lucide-react
// import { Building, MapPin, Calendar, FileText, ExternalLink, Download } from 'lucide-react';

interface InfoCardProps {
  companyName: string;
  licenseType: string;
  status: string;
  cnpj: string;
  address: string;
  city: string;
  emissionDate: string;
  documentName: string;
  description: string;
  latitude: number;
  longitude: number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  companyName,
  licenseType,
  status,
  cnpj,
  address,
  city,
  emissionDate,
  documentName,
  description,
  latitude,
  longitude,
}) => {
  return (
    <div className="max-w-sm w-full bg-white shadow-xl rounded-lg p-6 font-sans">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{companyName}</h2>
        {/* Ícone de fechar (X) - Adicionar funcionalidade de fechar o cartão */}
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${status === 'Aprovada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
          `}
        >
          {/* Ícone de check ou similar antes do status */}
          {status === 'Aprovada' && '✓ '}{status}
        </span>
        <span className="ml-2 text-sm text-gray-600">{licenseType}</span>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Informações da Empresa</h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          {/* Ícone CNPJ */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>
          CNPJ: {cnpj}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          {/* Ícone Endereço */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          {address}, {city}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Detalhes da Licença</h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          {/* Ícone Calendário */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          Emitida em: {emissionDate}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          {/* Ícone Documento */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          {documentName}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-1">Descrição</h3>
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">{description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-1">Localização</h3>
        <p className="text-sm text-gray-600 mb-2">Lat: {latitude}, Lng: {longitude}</p>
        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 border border-gray-300">
          {/* Placeholder para o mini-mapa */}
          <span className="text-xs">Mini-mapa aqui</span>
        </div>
        <button className="mt-2 w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 py-2 px-3 border border-gray-300 rounded-md hover:bg-gray-50">
          {/* Ícone Google Maps */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-6.998l4.875-2.437a.38.38 0 01.523.498l-4.5 12.75a.375.375 0 01-.67.06L12 12.75l-2.223 4.875a.375.375 0 01-.67-.06l-4.5-12.75a.375.375 0 01.523-.498L9 6.75z" /></svg>
          Ver no Google Maps
        </button>
      </div>

      <button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
        {/* Ícone Documento Completo */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        Ver Documento Completo
      </button>
    </div>
  );
};

export default InfoCard;

// Exemplo de uso (para teste, pode ser removido depois):
/*
const App = () => (
  <div className="p-10 bg-gray-100 min-h-screen flex items-center justify-center">
    <InfoCard 
      companyName="Indústria Alpha Ltda."
      licenseType="Licença de Operação"
      status="Aprovada"
      cnpj="11.222.333/0001-44"
      address="Rua Industrial, 100, Distrito Industrial"
      city="Joinville"
      emissionDate="14/05/2023"
      documentName="LO_Alpha_2023.pdf"
      description="Licença de Operação para Indústria Alpha..."
      latitude={-26.3034}
      longitude={-48.8457}
    />
  </div>
);
*/

