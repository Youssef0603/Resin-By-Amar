import React, { useState } from 'react'
import { Box, IconButton, useBreakpointValue, Text } from '@chakra-ui/react'
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import Slider from 'react-slick'

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
}

export default function Carousel(props) {
  const [slider, setSlider] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const images = props.images
  const top = useBreakpointValue({ base: '90%', md: '50%' })
  const side = useBreakpointValue({ base: '10px', md: '41%' })

  const handleNext = () => {
    slider && slider.slickNext()
    setCurrentSlide((prev) => prev + 1)
  }

  const handlePrev = () => {
    slider && slider.slickPrev()
    setCurrentSlide((prev) => prev - 1)
  }

  const handleDotClick = (index) => {
    slider && slider.slickGoTo(index)
    setCurrentSlide(index)
  }

  return (
    <Box
      position={'relative'}
      height={'600px'}
      width={'100%'} 
      maxWidth={'700px'}
      margin={'0 auto'} 
    >
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {/* Left Icon */}
      <IconButton
        aria-label="left-arrow"
        borderRadius="full"
        position="absolute"
        left="10px"
        top="50%"
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={handlePrev}>
        <ChevronLeftIcon />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        borderRadius="full"
        position="absolute"
        right="10px"
        top="50%"
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={handleNext}>
        <ChevronRightIcon />
      </IconButton>
      {/* Slider */}
      <Slider
        {...settings}
        ref={(slider) => setSlider(slider)}
        beforeChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)}>
        {images.map((image, index) => (
          <Box
            key={index}
            maxWidth={'700px'}
            maxHeight={'600px'}
            height={'6xl'}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundImage={`url(${image.cdn})`}
          />
          
        ))}
      </Slider>
      {/* Slide Number */}
      <Text
        position="absolute"
        bottom="10px"
        left="50%"
        transform="translateX(-50%)"
        zIndex="2"
        color="black"
        fontWeight={'bold'}
        fontSize={'30px'}>
        {currentSlide + 1}/{images.length}
      </Text>
    </Box>
  )
}

