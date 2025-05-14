import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CalendarDays, Filter, Building, Clock, Search, X, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ConstructionFilter } from '@/types/construction';
import { Input } from '@/components/ui/input';
import { DateRange } from 'react-day-picker';

interface FilterBarProps {
  onFilterChange: (filter: ConstructionFilter) => void;
  onSearch: (query: string) => void;
  cities: string[];
  licenseTypes: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onFilterChange, 
  onSearch,
  cities,
  licenseTypes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [status, setStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>('');

  const handleFilterApply = () => {
    onFilterChange({
      status: status,
      dateRange: {
        start: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        end: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      },
      city: selectedCity || undefined,
      licenseType: selectedLicenseType || undefined,
    });
  };

  const handleClearFilters = () => {
    setDateRange(undefined);
    setStatus('all');
    setSelectedCity('');
    setSelectedLicenseType('');
    
    onFilterChange({
      status: 'all',
      dateRange: {},
      city: undefined,
      licenseType: undefined,
    });
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="w-full sticky top-0 z-10 bg-background pt-4 pb-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar endereço, empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9 pr-4 h-11 rounded-full"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-11 w-11 rounded-full border-2 flex-shrink-0"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-w-[95vw]">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Data do Documento
                </h4>
                <Tabs defaultValue="range" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-2">
                    <TabsTrigger value="range">Intervalo</TabsTrigger>
                    <TabsTrigger value="month">Mês</TabsTrigger>
                  </TabsList>
                  <TabsContent value="range">
                    <div className="border rounded-md p-3">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        locale={ptBR}
                        className="rounded-md border pointer-events-auto"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="month">
                    <div className="border rounded-md p-3">
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          if (date) {
                            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                            setDateRange({ from: firstDay, to: lastDay });
                          }
                        }}
                        locale={ptBR}
                        className="rounded-md border pointer-events-auto"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Status
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={status === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatus('all')}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={status === 'approved' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatus('approved')}
                    className={status === 'approved' ? 'bg-status-approved' : ''}
                  >
                    Aprovados
                  </Button>
                  <Button 
                    variant={status === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatus('pending')}
                    className={status === 'pending' ? 'text-status-pending border-status-pending' : ''}
                  >
                    Pendentes
                  </Button>
                </div>
              </div>

              {cities.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Cidade
                  </h4>
                  <select 
                    className="w-full px-3 py-2 rounded-md border"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">Todas as cidades</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {licenseTypes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Tipo de Licença
                  </h4>
                  <select 
                    className="w-full px-3 py-2 rounded-md border"
                    value={selectedLicenseType}
                    onChange={(e) => setSelectedLicenseType(e.target.value)}
                  >
                    <option value="">Todos os tipos</option>
                    {licenseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
                <Button variant="default" size="sm" onClick={handleFilterApply}>
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FilterBar;
