import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Artwork} from '../api/store';
import {FC} from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import getAccentColor from '../utils/getAccentColor';

type CardProps = {
  item: Artwork;
  iiifUrl: string;
};

const Card: FC<CardProps> = ({item, iiifUrl}) => {
  const navigation = useNavigation();

  const imageURL =
    iiifUrl + '/' + item?.image_id + '/full/360,200/0/default.jpg';
  const imageURLFull =
    iiifUrl + '/' + item?.image_id + '/full/full/0/default.jpg';

  return (
    <LinearGradient
      colors={[
        'black',
        item?.color ? getAccentColor({color: item?.color}) : '#16534b',
      ]}
      style={layoutStyles.main}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      <TouchableOpacity
        style={layoutStyles.container}
        onPress={() =>
          (
            navigation.navigate as (
              name: 'Details',
              params: {data: Artwork; uri: string},
            ) => void
          )('Details', {
            data: item,
            uri: imageURLFull,
          })
        }>
        <Text style={textStyles.title}>{item?.title}</Text>
        <View style={layoutStyles.details}>
          <Image source={{uri: imageURL}} style={layoutStyles.cover} />
          <View style={layoutStyles.info}>
            <Text
              style={textStyles.description}
              numberOfLines={5}
              ellipsizeMode="tail">
              {item?.thumbnail?.alt_text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export const layoutStyles = StyleSheet.create({
  main: {
    width: '90%',
    height: 220,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  container: {
    width: '95%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 120,
    height: 120,
    marginLeft: 10,
    marginBottom: 10,
  },
  info: {
    width: '50%',
    marginLeft: 20,
  },
});

export const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Card;
