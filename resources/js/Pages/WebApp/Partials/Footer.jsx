'use client'
import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
    Image
} from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { ReactNode } from 'react'
import { primaryColor } from '@/Constants/Colors'

const Logo = (props) => {
    return (
        <Image
        boxSize='50px'
        objectFit='cover'
        src='/images/app/resinbyamarlogo-removebg.png'
        alt='Logo'
    />
    )
}

const SocialButton = ({
    children,
    label,
    href,
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    )
}

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}>
                <Logo />
                <Text color={'black'}>© 2024 Resin By Amar | Powered By Ali El Zein</Text>
                <Stack direction={'row'} spacing={6}>
                    <SocialButton label={'Twitter'} href={'#'}>
                        <FaInstagram />
                    </SocialButton>
                    <SocialButton label={'YouTube'} href={'#'}>
                        <FaWhatsapp />
                    </SocialButton>
                    <SocialButton label={'Instagram'} href={'#'}>
                        <FaFacebook />
                    </SocialButton>
                </Stack>
            </Container>
        </Box>
    )
}