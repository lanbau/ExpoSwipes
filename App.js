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

    // IF X increases, rotate towards 10 degrees
    // IF X decreases, rotate towards -10 degrees


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

    // If screenwidth is 200 for example, 
    // if x position is 200 or 150 within the range then opacity is 1 (Show like button)

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [ 
        -ScreenWidth/2, 
        0, 
        ScreenWidth/2
      ],
      outputRange: [
        0, 
        0, 
        1
      ],
      extrapolate: 'clamp'
    })

    // If screenwidth is -299 for example, 
    // if x position is -299 or -250 within the range then opacity is 1 (Show dislike button)
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [ 
        -ScreenWidth/2, 
        0, 
        ScreenWidth/2
      ],
      outputRange: [
        1, 
        0, 
        0
      ],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [ 
        -ScreenWidth/2, 
        0, 
        ScreenWidth/2
      ],
      outputRange: [
        1, 
        0, 
        1
      ],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [ 
        -ScreenWidth/2, 
        0, 
        ScreenWidth/2
      ],
      outputRange: [
        1, 
        0.8, 
        1
      ],
      extrapolate: 'clamp'
    })

  }

  componentWillMount () {
    this.PanResponder = PanResponder.create({
      
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy})
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: ScreenWidth + 100, y: gestureState.dy }
          })
          .start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({ x: 0, y: 0})
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -ScreenWidth - 100, y: gestureState.dy }
          })
          .start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({ x: 0, y: 0})
            })
          })
        } else {
          // Put back image to original
          Animated.spring(this.position, {
            toValue: { x:0, y:0 },
            friction: 4
          }).start()
        }
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
            <Animated.View 
              style={{
                opacity: this.likeOpacity, 
                transform: [{rotate: '-30deg'}], 
                position: 'absolute', 
                top:50, 
                left:40, 
                zIndex:1000
              }}>
              <Text style={{color:'white', fontSize: 40}}>LIKE</Text>
            </Animated.View>
            <Animated.View 
              style={{ 
                opacity: this.dislikeOpacity, 
                transform: [{rotate: '30deg'}], 
                position: 'absolute', 
                top:50, 
                right:40, 
                zIndex:1000
              }}>
              <Text style={{color:'red', fontSize: 40}}>NOPE</Text>
            </Animated.View>
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
                opacity: this.nextCardOpacity, 
                transform: [{scale: this.nextCardScale}], 
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