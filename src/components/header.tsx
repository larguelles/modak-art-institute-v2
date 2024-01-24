import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import NothingToSeeHere from './nothing-to-see-here';
import {View} from 'react-native';
import useArtworkStore from '../api/store';

type HeaderProps = {
  title: string;
  colors?: string[];
  renderGoBack: boolean;
  id: string;
};

const Header: React.FC<HeaderProps> = ({
  title,
  colors = ['#072a24', '#16534b'],
  renderGoBack,
  id,
}) => {
  const [nothing, setNothing] = useState<boolean>(false);
  const navigation = useNavigation();

  const {addEasterEggFound} = useArtworkStore();

  const handleNothing = () => {
    setNothing(true);
    addEasterEggFound(id);
  };

  useEffect(() => {
    if (nothing) {
      console.log('boca');
      setTimeout(setNothing, 5000, false);
    }
  }, [nothing]);
  return (
    <LinearGradient
      colors={colors}
      style={layoutStyles.main}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      {renderGoBack && (
        <TouchableOpacity
          style={layoutStyles.iconContainer}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={20} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={layoutStyles.titleContainer}
        onPress={() => handleNothing()}>
        {nothing ? (
          <View style={layoutStyles.nothing}>
            <NothingToSeeHere id={id} />
          </View>
        ) : (
          <Text style={textStyles.title}>{title}</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Header;

const layoutStyles = StyleSheet.create({
  main: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: 'black',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    top: 75,
    position: 'absolute',
  },
  titleContainer: {
    width: 'auto',
  },
  nothing: {
    top: 20,
  },
});
const textStyles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 40,
    textAlign: 'center',
    width: 280,
  },
});
