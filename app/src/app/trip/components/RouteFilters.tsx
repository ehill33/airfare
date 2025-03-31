'use client';

import { useState } from 'react';
import { ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FareClass, Trip } from '@/data/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveDialog from '@/components/ResponsiveDialog';
import { FilterState } from '@/hooks/useFilterRoutes';
import { Airport } from '@/lib/airport-util';

type RouteFiltersProps = {
  trip: Trip;
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
  applyFilters: () => void;
};

export default function RouteFilters({
  trip,
  filterState,
  setFilterState,
  applyFilters,
}: RouteFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    applyFilters();
    setIsOpen(false);
  };

  return (
    <ResponsiveDialog
      title='Filters'
      Trigger={<FilterButton isOpen={isOpen} setIsOpen={setIsOpen} />}
      Content={
        <RouteFiltersContent
          trip={trip}
          filterState={filterState}
          setFilterState={setFilterState}
        />
      }
      Footer={
        <div className='flex justify-end'>
          <Button onClick={handleApplyFilters}>Apply</Button>
        </div>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}

function FilterButton({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Button size='lg' onClick={() => setIsOpen(!isOpen)}>
      <ListFilter />
    </Button>
  );
}

function RouteFiltersContent({
  trip,
  filterState,
  setFilterState,
}: {
  trip: Trip;
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
}) {
  return (
    <div>
      <div className='flex justify-start space-x-2 mt-4 mb-2'>
        <FareClassButton
          fareClass='economy'
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <FareClassButton
          fareClass='business'
          filterState={filterState}
          setFilterState={setFilterState}
        />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <AirportList
          title='Departure Airports'
          airports={trip.departureAirports}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <AirportList
          title='Arrival Airports'
          airports={trip.arrivalAirports}
          filterState={filterState}
          setFilterState={setFilterState}
        />
      </div>
    </div>
  );
}

function FareClassButton({
  fareClass,
  filterState,
  setFilterState,
}: {
  fareClass: FareClass;
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
}) {
  const isSelected = filterState.fareClass === fareClass;

  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      onClick={() => setFilterState({ ...filterState, fareClass: fareClass })}
      className='capitalize'
    >
      {fareClass}
    </Button>
  );
}

function AirportList({
  title,
  airports,
  filterState,
  setFilterState,
}: {
  title: 'Departure Airports' | 'Arrival Airports';
  airports: Airport[];
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
}) {
  const filterStateKey =
    title === 'Departure Airports'
      ? 'filteredDepartureAirports'
      : 'filteredArrivalAirports';

  const handleAirportsCheckBoxChange = (airport: Airport) => {
    setFilterState({
      ...filterState,
      [filterStateKey]: filterState[filterStateKey].map((c) =>
        c.airportIata === airport.iata ? { ...c, isSelected: !c.isSelected } : c
      ),
    });
  };

  return (
    <div className=' p-2'>
      <h3 className='text-lg font-bold'>{title}</h3>
      <ul>
        {airports.map((airport) => (
          <li key={airport.id} className='flex items-center gap-2'>
            <Checkbox
              id={airport.id.toString()}
              checked={
                filterState[filterStateKey].find(
                  (c) => c.airportIata === airport.iata
                )?.isSelected
              }
              onCheckedChange={() => handleAirportsCheckBoxChange(airport)}
            />
            <label htmlFor={airport.id.toString()}>{airport.iata}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
