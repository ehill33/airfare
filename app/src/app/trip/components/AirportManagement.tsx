'use client';

import Combobox from '@/components/Combobox';
import ResponsiveDialog from '@/components/ResponsiveDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAirportManagement } from '@/hooks/useAirportManagement';
import { X } from 'lucide-react';
import { Trip } from '@/data/firestore';
import { Airport } from '@/lib/airport-util';

type AirportManagementProps = {
  trip: Trip;
};

export default function AirportManagement({ trip }: AirportManagementProps) {
  const airportManagementState = useAirportManagement({
    trip,
  });
  const {
    isOpen,
    activeTab,
    searchValue,
    searchResults,
    currentAirports,
    setIsOpen,
    setActiveTab,
    setSearchValue,
    addAirport,
    removeAirport,
    handleSave,
    handleCancel,
  } = airportManagementState;

  return (
    <ResponsiveDialog
      title='Airport Management'
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      Trigger={<Button size='lg'>Manage Airports</Button>}
      Content={
        <div className='flex flex-col gap-6'>
          <RadioGroup
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as 'departure' | 'arrival')
            }
            className='flex gap-4'
          >
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='departure' id='departure' />
              <Label htmlFor='departure'>Departure</Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem value='arrival' id='arrival' />
              <Label htmlFor='arrival'>Arrival</Label>
            </div>
          </RadioGroup>
          <div>
            <ul className='flex flex-wrap gap-2'>
              {Array.from(currentAirports).map((airport) => (
                <Badge key={airport.id || airport.iata}>
                  <div className='flex items-center gap-2'>
                    {airport.iata}
                    <Button
                      variant='ghost'
                      size='sm'
                      className='p-0 hover:bg-white'
                      onClick={() => removeAirport(airport)}
                    >
                      <X />
                    </Button>
                  </div>
                </Badge>
              ))}
            </ul>
          </div>
          <Combobox
            value={searchValue}
            setValue={setSearchValue}
            renderResults={
              <AirportOptions
                airports={searchResults}
                onOptionClick={addAirport}
              />
            }
          />
        </div>
      }
      Footer={
        <div className='flex gap-2 ml-auto'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          {/* TODO: Disabled so we don't accidently change this trips airports */}
          <Button disabled onClick={handleSave}>
            Save
          </Button>
        </div>
      }
    />
  );
}

function AirportOptions({
  airports,
  onOptionClick,
}: {
  airports: Airport[];
  onOptionClick: (option: Airport) => void;
}) {
  return (
    <div className='flex flex-col gap-2'>
      {airports.map((airport) => (
        <div
          key={airport.id}
          className='flex flex-col gap-1 hover:bg-gray-100 p-2 rounded-md'
          onClick={() => onOptionClick(airport)}
        >
          <p>
            {airport.name}
            <span className='text-sm text-gray-500 ml-2'>{airport.iata}</span>
          </p>
          <p className='text-sm text-gray-500'>
            {airport.city}, {airport.country}
          </p>
        </div>
      ))}
    </div>
  );
}
