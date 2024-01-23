import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import useArtworkStore from '../api/store';
const FavoriteButton = ({id}: {id: number}) => {
  const {favorites, addToFavorites} = useArtworkStore();

  const isFav = favorites?.includes(id?.toString());

  const handleFavPress = useCallback(() => {
    addToFavorites(id?.toString());
  }, [addToFavorites, id]);

  return (
    <TouchableOpacity onPress={handleFavPress}>
      <FontAwesomeIcon
        icon={isFav ? 'heart' : faHeart}
        color="#16534b"
        size={30}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
