import React, { useState, useEffect } from "react";

const Location = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }

    const onSuccess = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const onError = (error) => {
      setError(error.message);
    };

    geo.getCurrentPosition(onSuccess, onError);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (latitude && longitude) {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=300x200&markers=color:red%7Clabel:S%7C${latitude},${longitude}&key=AIzaSyCeykLk6bhm0J6hLGRMub62GJ-vUz-HwWQ`;
    return (
      <div>
        <div>
          Latitude: {latitude}, Longitude: {longitude}
        </div>
        <img src={mapUrl} alt="Google Map" />
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default Location;
