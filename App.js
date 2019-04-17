import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width

const Cards = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1517947138120-81858a0b2ab7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'},
  { id: '2', uri: 'https://vividsnaps.com/food/wp-content/uploads/2018/01/VividSnaps-Mooncake-Photographer-Singapore-002.jpg'}
]

export default class App extends React.Component {

  constructor () {
    super()
    // set to default (0,0)
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }
    console.log(-ScreenWidth/2)
    //https://facebook.github.io/react-native/docs/animations#interpolation
    this.rotate = this.position.x.interpolate({
      inputRange: [ 
        -ScreenWidth/2, 
        0, 
        ScreenWidth/2
      ],
      outputRange: [
        '-10deg', 
        '0deg', 
        '10deg'
      ],
      extrapolate: 'clamp'
    })

    //https://animationbook.codedaily.io/get-translate-transform/
    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    }

  }

  componentWillMount () {
    this.PanResponder = PanResponder.create({
      
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy})
      },
      onPanResponderRelease: (evt, gestureState) => {

      }
    })
  }

  renderCards = () => {
    return Cards.map( (item, index) => {

      if (index < this.state.currentIndex ) {
        return null
      }
      else if (index === this.state.currentIndex) {
        return (
          <Animated.View

            {...this.PanResponder.panHandlers}
            key={item.id}

            style={
            [
              this.rotateAndTranslate,
              { 
                height: ScreenHeight - 120, 
                width: ScreenWidth,
                padding: 10,
                position: 'absolute'
              }
            ]}
          >
            <Image
              style={{ flex: 1, borderRadius: 20 }}
              source={{ uri: item.uri }}
            />

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View
            key={item.id}

            style={
            [
              { 
                height: ScreenHeight - 120, 
                width: ScreenWidth,
                padding: 10,
                position: 'absolute'
              }
            ]}
          >
            <Image
              style={{ flex: 1, borderRadius: 20 }}
              source={{ uri: item.uri }}
            />

          </Animated.View>
        )
      }




      
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height:60 }}>

        </View>
        <View style={{ flex:1 }}>
          {this.renderCards()}
        </View>
        <View style={{ height:60 }}>

        </View>
        
      </View>
    );
  }
}