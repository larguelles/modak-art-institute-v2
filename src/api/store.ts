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
  api_model: string;
  api_link: string;
  is_boosted: boolean;
  title: string;
  alt_titles: null | string[];
  thumbnail: {
    lqip: string;
    width: number;
    height: number;
    alt_text: string;
  };
  main_reference_number: string;
  has_not_been_viewed_much: boolean;
  boost_rank: number;
  date_start: number;
  date_end: number;
  date_display: string;
  date_qualifier_title: string;
  date_qualifier_id: null | number;
  artist_display: string;
  place_of_origin: string;
  description: string;
  short_description: string;
  dimensions: string;
  dimensions_detail: [
    {
      depth: null;
      width: number;
      height: number;
      diameter: null;
      clarification: null;
    },
  ];
  medium_display: string;
  inscriptions: null;
  credit_line: string;
  catalogue_display: null;
  publication_history: null;
  exhibition_history: null;
  provenance_text: null;
  edition: null;
  publishing_verification_level: string;
  internal_department_id: number;
  fiscal_year: number;
  fiscal_year_deaccession: null;
  is_public_domain: boolean;
  is_zoomable: boolean;
  max_zoom_window_size: number;
  copyright_notice: null;
  has_multimedia_resources: boolean;
  has_educational_resources: boolean;
  has_advanced_imaging: boolean;
  colorfulness: number;
  color: {
    h: number;
    l: number;
    s: number;
    percentage: number;
    population: number;
  };
  latitude: number;
  longitude: number;
  latlon: string;
  is_on_view: boolean;
  on_loan_display: null;
  gallery_title: string;
  gallery_id: number;
  nomisma_id: null;
  artwork_type_title: string;
  artwork_type_id: number;
  department_title: string;
  department_id: string;
  artist_id: number;
  artist_title: string;
  alt_artist_ids: number[];
  artist_ids: number[];
  artist_titles: string[];
  category_ids: string[];
  category_titles: string[];
  term_titles: string[];
  style_id: string;
  style_title: string;
  alt_style_ids: string[];
  style_ids: string[];
  style_titles: string[];
  classification_id: string;
  classification_title: string;
  alt_classification_ids: string[];
  classification_ids: string[];
  classification_titles: string[];
  subject_id: string;
  alt_subject_ids: string[];
  subject_ids: string[];
  subject_titles: string[];
  material_id: string;
  alt_material_ids: string[];
  material_ids: string[];
  material_titles: string[];
  technique_id: string;
  alt_technique_ids: string[];
  technique_ids: string[];
  technique_titles: string[];
  theme_titles: string[];
  image_id: string;
  alt_image_ids: string[];
  document_ids: string[];
  sound_ids: string[];
  video_ids: string[];
  text_ids: string[];
  section_ids: string[];
  section_titles: string[];
  site_ids: string[];
  suggest_autocomplete_boosted: string;
  suggest_autocomplete_all: Array<{
    input: string[];
    contexts: {
      groupings: string[];
    };
    weight?: number;
  }>;
  source_updated_at: string;
  updated_at: string;
  timestamp: string;
} & ResponseConfigAndInfo;

type StoreType = {
  artworks: ArtworksResponse | [];
  artworkById: Artwork | {};
  favorites: string[] | [];
  fetchArtworks: () => Promise<void>;
  fetchArtworkById: (id: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (artworkId: string) => Promise<void>;
};

const useArtworkStore = create<StoreType>(
  (set: StoreApi<StoreType>['setState']) => ({
    artworks: [],
    artworkById: {},
    favorites: [],
    fetchArtworks: async () => {
      try {
        const response: AxiosResponse<ArtworksResponse> = await axios.get(
          'https://api.artic.edu/api/v1/artworks',
        );
        set({artworks: response.data, artworkById: {}});
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    },
    fetchArtworkById: async (id: string) => {
      try {
        const response: AxiosResponse<ArtworksResponse> = await axios.get(
          `https://api.artic.edu/api/v1/artworks/${id}`,
        );
        set({
          artworks: {
            pagination: {
              total: 1,
              limit: 1,
              offset: 0,
              total_pages: 1,
              current_page: 1,
            },
            data: response.data.data,
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
          artworkById: {[id]: response.data.data},
        });
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
    fetchFavorites: async () => {
      try {
        const favoriteIdsJSON = await AsyncStorage.getItem('favorites');
        const favoriteIds: string[] = favoriteIdsJSON
          ? JSON.parse(favoriteIdsJSON)
          : [];

        const favoriteArtworks = await Promise.all(
          favoriteIds.map(async (id: string) => {
            const response = await axios.get(
              `https://api.artic.edu/api/v1/artworks/${id}`,
            );
            return response.data.data;
          }),
        );
        set({
          artworks: {
            pagination: {
              total: favoriteArtworks.length,
              limit: favoriteArtworks.length,
              offset: 0,
              total_pages: 1,
              current_page: 1,
            },
            data: favoriteArtworks,
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
          artworkById: {},
        });
      } catch (error) {
        console.error('Error fetching favorite artworks:', error);
      }
    },
  }),
);
export default useArtworkStore;
