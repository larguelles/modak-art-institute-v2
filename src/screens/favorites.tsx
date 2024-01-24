import React, {useEffect, FC} from 'react';
import {View, FlatList} from 'react-native';
import Card from '../components/card';
import Header from '../components/header';
import useArtworkStore, {Artwork} from '../api/store';

const viewStyle = {flex: 1};

const Favorites: FC = () => {
  const {artworks, fetchFavorites} = useArtworkStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const renderItem = ({item}: {item: Artwork}) => {
    return <Card item={item} iiifUrl={artworks?.config?.iiif_url} />;
  };

  return (
    <View style={viewStyle}>
      <Header title="Favorites" renderGoBack id="favs" />
      <FlatList data={artworks?.data} renderItem={renderItem} />
    </View>
  );
};

export default Favorites;
