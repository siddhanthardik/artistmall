import React from 'react';
import { ArtistPriceCard } from './ArtistPriceCard';
import { Artist } from '../../types';

interface ArtistSidebarProps {
  artist: Artist;
  onBookNow: () => void;
}

export const ArtistSidebar: React.FC<ArtistSidebarProps> = React.memo(({ artist, onBookNow }) => {
  return (
    <div className="sticky top-32 space-y-8">
      <ArtistPriceCard artist={artist} onBookNow={onBookNow} />
    </div>
  );
});

ArtistSidebar.displayName = 'ArtistSidebar';
