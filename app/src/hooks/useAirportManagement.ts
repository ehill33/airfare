import { useEffect, useState } from 'react';
import { Airport, searchAirport } from '@/lib/airport-util';
import { useDebounce } from './useDebounce';
import { Trip } from '@/data/firestore';
import { saveTrip } from '@/app/trip/actions';

type AirportType = 'departure' | 'arrival';

interface UseAirportManagementProps {
  trip: Trip;
}

export function useAirportManagement({ trip }: UseAirportManagementProps) {
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<AirportType>('departure');

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Airport[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Airport collections state
  const [updatedDepartureAirports, setUpdatedDepartureAirports] = useState<
    Set<Airport>
  >(new Set(trip.departureAirports));
  const [updatedArrivalAirports, setUpdatedArrivalAirports] = useState<
    Set<Airport>
  >(new Set(trip.arrivalAirports));

  // Get the current set of airports based on active tab
  const currentAirports =
    activeTab === 'departure'
      ? updatedDepartureAirports
      : updatedArrivalAirports;

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('departure');
      setSearchValue('');
    }
  }, [isOpen, setSearchValue]);

  // Search for airports when the debounced search value changes
  useEffect(() => {
    const airports = searchAirport(debouncedSearchValue);
    setSearchResults(airports);
  }, [debouncedSearchValue]);

  // Add an airport to the collection
  const addAirport = (airport: Airport) => {
    if (activeTab === 'departure') {
      const newSet = new Set(updatedDepartureAirports);
      newSet.add(airport);
      setUpdatedDepartureAirports(newSet);
    } else {
      const newSet = new Set(updatedArrivalAirports);
      newSet.add(airport);
      setUpdatedArrivalAirports(newSet);
    }

    // Clear search after adding
    setSearchValue('');
  };

  // Remove an airport from the collection
  const removeAirport = (airport: Airport) => {
    if (activeTab === 'departure') {
      const updatedAirports = new Set(updatedDepartureAirports);
      updatedAirports.delete(airport);
      setUpdatedDepartureAirports(updatedAirports);
    } else {
      const updatedAirports = new Set(updatedArrivalAirports);
      updatedAirports.delete(airport);
      setUpdatedArrivalAirports(updatedAirports);
    }
  };

  // Reset to initial values
  const resetAirports = () => {
    setUpdatedDepartureAirports(new Set(trip.departureAirports));
    setUpdatedArrivalAirports(new Set(trip.arrivalAirports));
  };

  // Combined actions for UI
  const handleSave = () => {
    const updatedTrip = {
      ...trip,
      departureAirports: Array.from(updatedDepartureAirports),
      arrivalAirports: Array.from(updatedArrivalAirports),
    };
    saveTrip(updatedTrip);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resetAirports();
    setIsOpen(false);
  };

  return {
    // State
    isOpen,
    setIsOpen,
    activeTab,
    searchValue,
    searchResults,
    updatedDepartureAirports,
    updatedArrivalAirports,
    currentAirports,

    // Setters
    setActiveTab,
    setSearchValue,

    // Actions
    addAirport,
    removeAirport,
    resetAirports,
    handleSave,
    handleCancel,
  };
}
