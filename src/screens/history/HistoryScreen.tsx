import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import paymentAPI from '../../apis/paymentAPI';
import COLORS from '../../assets/colors/Colors';
import { BoxStatusShopOrderComponent, CardOrderShopComponent, HeaderComponent, SectionComponent } from '../../components';
import { PaymentModel } from '../../model/payment_model';
import { authSelector } from '../../redux/reducers/authReducer';

const HistoryScreen = ({ navigation }: any) => {
  const user = useSelector(authSelector);
  const [payment, setPayment] = useState<PaymentModel[]>([]);
  const [filteredPayment, setFilteredPayment] = useState<PaymentModel[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả'); // Trạng thái được chọn
  const [statusList, setStatusList] = useState([
    { status: 'Tất cả', number: 0 },
    { status: 'Chờ duyệt', number: 0 },
    { status: 'Đang giặt', number: 0 },
    { status: 'Đang giao', number: 0 },
    { status: 'Hoàn thành', number: 0 },
    { status: 'Đã hủy', number: 0 },
  ]);

  const handleStatusPress = (status: string) => {
    setSelectedStatus(status);
    console.log(`Selected status: ${status}`);

    if (status === 'Tất cả') {
      setFilteredPayment(payment);
      console.log('Payment data:', payment);
    } else {
      console.log(`Selected status 1: ${status}`);
      const filtered = payment.filter((item) => item.shop_details[0].confirmationStatus == status);
      setFilteredPayment(filtered);
      console.log('Filtered data:', filtered);
    }
  };

  const handleOrderPress = (id: string) => {
    console.log('Selected payment: ', id);
  };

  const getDataPayment = async () => {
    try {
      const res: any = await paymentAPI.HandlePayment(`/get-order-by-id-shop?userId=${user?.id}`);
      const data: PaymentModel[] = res.data;
      setPayment(data);
      setFilteredPayment(data);

      // Đếm số lượng đơn hàng theo từng trạng thái
      const updatedStatusList = statusList.map((statusItem) => {
        if (statusItem.status === 'Tất cả') {
            return { ...statusItem, number: data.length };
        }
    
        const count = data.reduce((acc, item) => {
            // Duyệt qua tất cả các shop_details và kiểm tra confirmationStatus
            const matchingStatus = item.shop_details.some((shop) => shop.confirmationStatus === statusItem.status);
            return matchingStatus ? acc + 1 : acc;
        }, 0);
    
        return { ...statusItem, number: count };
    });

      setStatusList(updatedStatusList);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    getDataPayment();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getDataPayment();
    }, [])
  );
  const mountServiceByIdShop=(service_fee:any,shipping_fee:any)=>{
    return service_fee + shipping_fee
  }
  return (
    <View style={{ backgroundColor: COLORS.WHITE, flex: 1 }}>
      <HeaderComponent title="Đơn hàng" isBack onBack={() => navigation.goBack()} />

      <SectionComponent>
        <FlatList
          data={statusList}
          horizontal
          keyExtractor={(item) => item.status}
          renderItem={({ item }) => (
            <BoxStatusShopOrderComponent
              status={item.status}
              number={item.number}
              onPress={() => handleStatusPress(item.status)}
              isSelected={selectedStatus === item.status}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </SectionComponent>

      <SectionComponent styles={{ paddingBottom: 200 }}>
        <FlatList
          data={filteredPayment}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id.toString()}
          renderItem={({ item }) => (
            <CardOrderShopComponent
              id={item?._id.toString().substring(0, 10)}
              status={item.shop_details[0].confirmationStatus}
              price={mountServiceByIdShop(item.shop_details[0].service_fee,item.shop_details[0].shipping_fee)}
              imgUrl={item?.id_cart[0]?.id_product?.product_photo[0]}
              dateOrder={new Date(item.createdAt).toLocaleDateString('vi-VN')}
              onPress={() => navigation.navigate('OrderConfirmationScreen', { confirmationStatus: item.shop_details[0].confirmationStatus ,paymentData:item})}
            />
          )}
        />
      </SectionComponent>
    </View>
  );
};

export default HistoryScreen;

