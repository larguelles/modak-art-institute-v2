import React, {useEffect, FC} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import useArtworkStore, {Artwork} from '../api/store';
import {View} from 'react-native';
import Card from '../components/card';
import Header from '../components/header';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

type HomeProps = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
};

const Home: FC<HomeProps> = ({navigation}) => {
  const {fetchArtworks, artworks} = useArtworkStore();

  const onPressHome = () => {
    navigation.navigate('Home');
  };

  const onPressFavorites = () => {
    navigation.navigate('Favorites');
  };

  const renderItem = ({item}: {item: Artwork}) => (
    <Card item={item} iiifUrl={artworks?.config?.iiif_url} />
  );

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks, artworks]);
  return (
    <View style={layoutStyles.main}>
      <Header renderGoBack={false} title="Modak Art Institute" />
      <FlatList data={artworks?.data} renderItem={renderItem} />
      <LinearGradient
        style={layoutStyles.favorites}
        colors={['#072a24', '#16534b']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <TouchableOpacity onPress={() => onPressHome()}>
          <Icon name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressFavorites()}>
          <Icon name="heart" size={30} color="white" />
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
