import React, {FC} from 'react';
import {Text, View, Image, ScrollView, StyleSheet} from 'react-native';
import Header from '../components/header';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/core';
import FavoriteButton from '../components/fav-button';

const InfoText = ({
  type,
  info,
  accentColor,
}: {
  type: string;
  info: string;
  accentColor: string;
}) => {
  return (
    <View style={[layoutStyles.info, {borderColor: accentColor}]}>
      <Text style={textStyles.infoType}>{type}:</Text>
      <Text style={textStyles.info}>{info}</Text>
    </View>
  );
};

type DetailsProps = {
  route: RouteProp<RootStackParamList, 'Details'>;
};

const Details: FC<DetailsProps> = ({route}) => {
  const {data, uri} = route.params;

  console.log('uri', uri);
  const accentColor =
    'hsl(' +
    data?.color?.h +
    ', ' +
    data?.color?.s +
    '%, ' +
    data?.color?.l +
    '%)';

  return (
    <View style={layoutStyles.main}>
      <Header title={data.title} colors={['black', accentColor]} renderGoBack />
      <ScrollView>
        <Image source={{uri: uri}} style={layoutStyles.artwork} />
        <View style={layoutStyles.details}>
          <FavoriteButton id={data?.id} />
          <View style={layoutStyles.artistDisplay}>
            <Text style={textStyles.info}>{data.artist_display}</Text>
          </View>
        </View>
        <InfoText
          type="Category"
          info={data?.category_titles[0]}
          accentColor={accentColor}
        />
        <InfoText
          type="Credit"
          info={data.credit_line}
          accentColor={accentColor}
        />
        <InfoText
          type="Dated"
          info={data.date_display}
          accentColor={accentColor}
        />
        <InfoText
          type="Display"
          info={data.medium_display}
          accentColor={accentColor}
        />
        <InfoText
          type="Place of origin"
          info={data.place_of_origin}
          accentColor={accentColor}
        />
      </ScrollView>
    </View>
  );
};

const layoutStyles = StyleSheet.create({
  main: {
    flex: 1,
  },
  artwork: {
    flex: 1,
    width: 360,
    height: 400,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  details: {
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  favorite: {
    borderWidth: 3,
    width: 120,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginVertical: 5,
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
  },
  artistDisplay: {
    width: '60%',
  },
});

const textStyles = StyleSheet.create({
  infoType: {
    fontSize: 16,
    fontWeight: '500',
  },
  info: {
    fontSize: 14,
    fontWeight: '500',
  },
  favorite: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Details;
