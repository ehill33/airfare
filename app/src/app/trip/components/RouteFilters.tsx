'use client';

import { useState } from 'react';
import { ListFilterPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import useMediaQuery from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FareClass } from '@/data/firestore';
import { Checkbox } from '@/components/ui/checkbox';

type FilterState = {
  fareClass: FareClass;
  filteredDepartingCities: { city: string; isSelected: boolean }[];
  filteredArrivingCities: { city: string; isSelected: boolean }[];
};

type RouteFiltersProps = {
  departingCities: string[];
  arrivingCities: string[];
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
  applyFilters: () => void;
};

export default function RouteFilters({
  departingCities,
  arrivingCities,
  filterState,
  setFilterState,
  applyFilters,
}: RouteFiltersProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    applyFilters();
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <FilterButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <RouteFiltersContent
            departingCities={departingCities}
            arrivingCities={arrivingCities}
            filterState={filterState}
            setFilterState={setFilterState}
          />
          <div className='p-4'>
            <Button onClick={handleApplyFilters}>Apply</Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FilterButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </DialogTrigger>
      <DialogContent className='container mx-auto'>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <RouteFiltersContent
          departingCities={departingCities}
          arrivingCities={arrivingCities}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <DialogFooter>
          <Button onClick={handleApplyFilters}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    <Button size='lg' className='my-4' onClick={() => setIsOpen(!isOpen)}>
      <ListFilterPlus />
    </Button>
  );
}

function RouteFiltersContent({
  departingCities,
  arrivingCities,
  filterState,
  setFilterState,
}: {
  departingCities: string[];
  arrivingCities: string[];
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
        <CitiesList
          title='Departing Cities'
          cities={departingCities}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <CitiesList
          title='Arriving Cities'
          cities={arrivingCities}
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

function CitiesList({
  title,
  cities,
  filterState,
  setFilterState,
}: {
  title: string;
  cities: string[];
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
}) {
  const filterStateKey =
    title === 'Departing Cities'
      ? 'filteredDepartingCities'
      : 'filteredArrivingCities';

  const handleCitiesCheckBoxChange = (city: string) => {
    setFilterState({
      ...filterState,
      [filterStateKey]: filterState[filterStateKey].map((c) =>
        c.city === city ? { ...c, isSelected: !c.isSelected } : c
      ),
    });
  };

  return (
    <div className=' p-2'>
      <h3 className='text-lg font-bold'>{title}</h3>
      <ul>
        {cities.map((city) => (
          <li key={city} className='flex items-center gap-2'>
            <Checkbox
              id={city}
              checked={
                filterState[filterStateKey].find((c) => c.city === city)
                  ?.isSelected
              }
              onCheckedChange={() => handleCitiesCheckBoxChange(city)}
            />
            <label htmlFor={city}>{city}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
