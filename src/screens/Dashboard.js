import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import ProductItem from '../components/ProductItem'
import { View } from 'react-native-web'
import { FlatList } from 'react-native'


const products = [
  { id: 1, name: 'Sản phẩm 1', price: '10.000vnđ' },
  { id: 2, name: 'Sản phẩm 2', price: '20.000vnđ' },
  { id: 3, name: 'Sản phẩm 3', price: '30.000vnđ' },
];

export default function Dashboard(navigation) {
  return (
    <View>
    <Header title="Shop" />
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ProductItem name={item.name} price={item.price} />
      )}
    />
  </View>
  );
};