import React, { useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Alert, AlertDescription } from '@/shadcn/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const GeolocationComponent: React.FC = () => {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission(true);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLocationPermission(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const getCoordinates = () => {
    if (locationPermission) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setError(null);
        },
        (err) => {
          setError(err.message);
          setCoordinates(null);
        }
      );
    } else {
      setError('Location permission not granted');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Button 
        onClick={requestLocationPermission}
        className="w-full"
        variant={locationPermission ? "outline" : "default"}
      >
        {locationPermission ? 'Permission Granted' : 'Request Location Permission'}
      </Button>

      <Button 
        onClick={getCoordinates} 
        disabled={!locationPermission}
        className="w-full"
      >
        Get Coordinates
      </Button>

      {coordinates && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Latitude: {coordinates.latitude.toFixed(6)}</p>
          <p>Longitude: {coordinates.longitude.toFixed(6)}</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default GeolocationComponent;