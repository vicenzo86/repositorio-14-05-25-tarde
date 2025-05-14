export type StatusValue = "Aprovada" | "Consulta" | "Análise";

export interface Construction {
  id: string; // Mantido, assumindo que o Supabase gera um ID ou que "Nome do Arquivo" pode ser usado como tal se for único.
  "Nome do Arquivo": string;
  "Data": string; // Formato YYYY/MM/DD no CSV
  "Tipo de Licença": string;
  "CNPJ": string;
  "Endereço": string;
  "Nome da Empresa": string;
  "Cidade": string;
  "Área Construída": number | string;
  "Área do Terreno": number | string;
  latitude: number;
  longitude: number;
  status: StatusValue; // Campo status agora é obrigatório e usa os novos valores
}

export type ConstructionFilter = {
  status?: StatusValue | "all"; // Filtro de status atualizado com os novos valores
  dateRange?: {
    start?: string;
    end?: string;
  };
  licenseType?: string; // Corresponde a "Tipo de Licença"
  city?: string; // Corresponde a "Cidade"
};

export type CategoryOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

