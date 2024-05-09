import React from 'react'
import { Divider, Box, Button, Icon, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiArrowUp } from "react-icons/fi";
import NavBar from './Partials/Navbar';
import Footer from './Partials/Footer';
import Hero from './Partials/Hero';
import Featured from './Partials/Featured';
import Categories from './Partials/Categories';

function Index() {
    const [showButton, setShowButton] = useState(false);
    useEffect(() => {
        const handleButtonVisible = () => {
            window.pageYOffset > 300 ? setShowButton(true) : setShowButton(false)
        }
        window.addEventListener('scroll', handleButtonVisible);
        return () => {
            window.removeEventListener('scroll', handleButtonVisible);
        }
    }, [])
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <Box>
            <NavBar />
            <Box overflowX={"hidden"} id='introduction' height={'700px'} bgImage={'/images/app/bgImage.jpeg'}>
                <Hero />
            </Box>
            <Box id='Featured' pt={20} pl={20}>
                <Featured />
            </Box>
            <Box id='Featured' pt={20} pl={20}>
                <Categories />
            </Box>
            <Footer />
        </Box>
    )
}

export default Index
