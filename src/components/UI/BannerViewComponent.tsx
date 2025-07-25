import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const BannerViewComponent = ({ title , subTitle}:any) => {
  return (
    <View style={{flex:0.2,top:30,backgroundColor:'transparent'}}>
    <Image source={require('../../assets/images/MainLogo.png')} style={{height:40,width:'70%',alignSelf:'center'}} />
          <View style={{top:80}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
          </View>
    </View>
  )
}

export default BannerViewComponent

const styles = StyleSheet.create({
      title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
    subTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
})