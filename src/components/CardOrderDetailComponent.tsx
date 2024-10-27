import React from 'react';
import { Image, StyleProp, View, ImageStyle, TouchableOpacity } from 'react-native';
import { RowComponent, SectionComponent, ButtonComponent, TextComponent } from '../components';
import COLORS from '../assets/colors/Colors';
import { FONTFAMILY } from '../../assets/fonts';
import IMAGES from '../assets/images/Images';

interface Props {
    id: string;
    productName: string;
    status: string;
    price: number;
    quantity: number;
    imageUrl: string;
}


const CardOrderDetailComponent = (props: Props) => {
    const { id, productName, status, price, quantity, imageUrl } = props;
  
    return (
      <SectionComponent>
        <TextComponent text='Sản phẩm(2)' size={16} color={COLORS.HEX_BLACK} font={FONTFAMILY.montserrat_bold} styles={{marginBottom: 20, marginTop: 10}}/>
        <RowComponent justify="space-between" styles={{ alignItems: 'flex-start' }}>
          <Image source={IMAGES.demoImage} style={{ width: 100, height: 100, marginRight: 10 }} />
          <View style={{ width: '78%' }}>
            <TextComponent text={productName} size={16} color={COLORS.HEX_BLACK} font={FONTFAMILY.montserrat_bold}/>
            <TextComponent text={status} size={16} color={COLORS.HEX_BLACK} />
            <TextComponent text={`${price}đ`} size={18} color={COLORS.HEX_BLACK} font={FONTFAMILY.montserrat_bold}/>
          </View>
        </RowComponent>
      </SectionComponent>
    );
  };
export default CardOrderDetailComponent;
