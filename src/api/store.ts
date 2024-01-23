import {StoreApi, create} from 'zustand';
import axios, {AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ResponseConfigAndInfo = {
  info: {
    license_text: string;
    license_links: string[];
    version: string;
  };
  config: {
    iiif_url: string;
    website_url: string;
  };
};

export type ArtworksResponse = {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url?: string;
  };
  data: Artwork[];
} & ResponseConfigAndInfo;

export type Artwork = {
  id: number;
  image_id: string;
  title: string;
  thumbnail: {
    lqip: string;
    width: number;
    height: number;
    alt_text: string;
  };
  date_display: string;
  artist_display: string;
  place_of_origin: string;
  description: string;
  dimensions: string;
  medium_display: string;
  credit_line: string;
  color: {
    h: number;
    l: number;
    s: number;
    percentage: number;
    population: number;
  };
  category_titles: string[];
} & ResponseConfigAndInfo;

type StoreType = {
  artworks: ArtworksResponse;
  artworkById: {[key: string]: Artwork};
  favorites: string[];
  fetchArtworks: (page?: number) => Promise<void>;
  fetchArtworkById: (id: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (artworkId: string) => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const useArtworkStore = create<StoreType>(
  (set: StoreApi<StoreType>['setState']) => ({
    artworks: {
      pagination: {
        total: 0,
        limit: 0,
        offset: 0,
        total_pages: 0,
        current_page: 0,
      },
      data: [],
      info: {
        license_text: '',
        license_links: [],
        version: '',
      },
      config: {
        iiif_url: '',
        website_url: '',
      },
    },
    currentPage: 1,
    artworkById: {},
    favorites: [],
    fetchArtworks: async (page = 1) => {
      try {
        const response: AxiosResponse<ArtworksResponse> = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${page}&fields=id,image_id,title,thumbnail,artist_display,date_display,main_reference_number,credit_line,medium_display,place_of_origin,description,dimensions,color,category_titles`,
        );

        set(state => ({
          artworks: {
            pagination: response.data.pagination,
            data:
              page === 1
                ? response.data.data
                : [...state.artworks.data, ...response.data.data],
            info: response.data.info,
            config: response.data.config,
          },
          currentPage: page,
          artworkById: {
            ...state.artworkById,
            ...response.data.data.reduce((acc, artwork) => {
              acc[artwork.id] = artwork;
              return acc;
            }, {} as {[key: string]: Artwork}),
          },
        }));
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    },
    fetchArtworkById: async (id: string) => {
      try {
        const response: AxiosResponse<ArtworksResponse> = await axios.get(
          `https://api.artic.edu/api/v1/artworks/${id}?fields=id,image_id,title,thumbnail,artist_display,date_display,main_reference_number,credit_line,medium_display,place_of_origin,description,dimensions,color,category_titles`,
        );
        set(state => ({
          artworks: {
            pagination: response.data.pagination,
            data: response.data.data,
            info: response.data.info,
            config: response.data.config,
          },
          artworkById: {
            ...state.artworkById,
            [id]: response.data.data[0],
          },
        }));
      } catch (error) {
        console.error(`Error fetching artwork with ID ${id}:`, error);
      }
    },
    addToFavorites: async (artworkId: string) => {
      try {
        const currentFavoritesJSON = await AsyncStorage.getItem('favorites');
        const currentFavorites: string[] = currentFavoritesJSON
          ? JSON.parse(currentFavoritesJSON)
          : [];
        const updatedFavorites = [...currentFavorites, artworkId];
        await AsyncStorage.setItem(
          'favorites',
          JSON.stringify(updatedFavorites),
        );
        set({favorites: updatedFavorites});
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    },
    removeFromFavorites: async (artworkId: string) => {
      try {
        const currentFavoritesJSON = await AsyncStorage.getItem('favorites');
        const currentFavorites: string[] = currentFavoritesJSON
          ? JSON.parse(currentFavoritesJSON)
          : [];
        const indexToRemove = currentFavorites.indexOf(artworkId);
        if (indexToRemove !== -1) {
          currentFavorites.splice(indexToRemove, 1);
          await AsyncStorage.setItem(
            'favorites',
            JSON.stringify(currentFavorites),
          );
          set({favorites: currentFavorites});
        }
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    },
    fetchFavorites: async () => {
      try {
        const favoriteIdsJSON = await AsyncStorage.getItem('favorites');
        const favoriteIds: string[] = favoriteIdsJSON
          ? JSON.parse(favoriteIdsJSON)
          : [];

        const favoriteArtworks = await Promise.all(
          favoriteIds.map(async (id: string) => {
            const response = await axios.get(
              `https://api.artic.edu/api/v1/artworks/${id}?fields=id,image_id,title,thumbnail,artist_display,date_display,main_reference_number,credit_line,medium_display,place_of_origin,description,dimensions,color,category_titles`,
            );
            return response.data.data;
          }),
        );
        set(state => ({
          artworks: {
            pagination: {
              total: favoriteArtworks.length,
              limit: favoriteArtworks.length,
              offset: 0,
              total_pages: 1,
              current_page: 1,
            },
            data: favoriteArtworks,
            info: {...state.artworks.info},
            config: {
              ...state.artworks.config,
            },
          },
          artworkById: favoriteArtworks.reduce((acc, artwork) => {
            acc[artwork.id] = artwork;
            return acc;
          }, {} as {[key: string]: Artwork}),
        }));
      } catch (error) {
        console.error('Error fetching favorite artworks:', error);
      }
    },
    setCurrentPage: (page: number) => {
      set({
        currentPage: page,
      });
    },
  }),
);
export default useArtworkStore;
