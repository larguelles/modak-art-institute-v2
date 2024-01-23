import React, {useEffect, FC, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import useArtworkStore, {Artwork} from '../api/store';
import {View} from 'react-native';
import Card from '../components/card';
import Header from '../components/header';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

type HomeProps = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
};

const Home: FC<HomeProps> = ({navigation}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {artworks, fetchArtworks, currentPage} = useArtworkStore();

  const onPressHome = () => {
    navigation.navigate('Home');
  };

  const onPressFavorites = () => {
    navigation.navigate('Favorites');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArtworks(1);
    setRefreshing(false);
  };

  const onEndReached = () => {
    fetchArtworks(currentPage + 1);
  };

  const renderItem = ({item}: {item: Artwork}) => (
    <Card key={item?.id} item={item} iiifUrl={artworks?.config.iiif_url} />
  );

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return (
    <View style={layoutStyles.main}>
      <Header renderGoBack={false} title="Modak Art Institute" />
      <FlatList
        data={artworks?.data}
        renderItem={renderItem}
        onEndReached={onEndReached}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <LinearGradient
        style={layoutStyles.favorites}
        colors={['#072a24', '#16534b']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <TouchableOpacity onPress={() => onPressHome()}>
          <FontAwesomeIcon icon="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressFavorites()}>
          <FontAwesomeIcon icon="heart" size={30} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const layoutStyles = StyleSheet.create({
  main: {
    flex: 1,
  },
  favorites: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Home;
