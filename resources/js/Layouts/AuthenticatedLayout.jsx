import {
    Box,
    Drawer,
    DrawerContent,
    useDisclosure,
    useColorModeValue,
    useToast
} from '@chakra-ui/react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtl from 'stylis-plugin-rtl'
import React, { useEffect, useState } from 'react'
import MobileNav from './Partials/MobileNav'
import SidebarNav from './Partials/SidebarNav'
import { useTranslation } from 'react-i18next'

export default function AuthenticatedLayout(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { t, i18n } = useTranslation()
    const toast = useToast();
    const [flashMessage, setFlashMessage] = useState('');
    let currentLang = localStorage.getItem('lang');
    
    const options = {
        rtl: { key: 'css-ar', stylisPlugins: [rtl] },
        ltr: { key: 'css-en' },
    }
    const cache = createCache(options[currentLang == 'ar' ? "rtl" : "ltr"])


    useEffect(() => {
        if ((props.flash && Object.keys(props.flash).length > 0)) {
            let flashKeys = Object.keys(props.flash)
            let status = flashKeys.length > 0 ? flashKeys[0] : 'success'
            if (props.flash[status] != flashMessage) {
                toast({
                    title: props.flash[status],
                    status: status,
                    duration: 2500,
                    isClosable: true,
                    onCloseComplete: (e) => {
                        setFlashMessage('')
                    }
                });
                setFlashMessage(props.flash[status]);
            }
        }
    }, [props.flash])

    return (
        <CacheProvider value={cache} >
            <Box>
                <SidebarNav
                    t={t}
                    onClose={onClose}
                    mainPlatform={props.auth.main_platform}
                    platform={props.auth.platform}
                    display={{ base: 'none', md: 'block' }} />
                <Drawer
                    placement={currentLang == "ar" ? "right" : "left"}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    onClose={onClose}
                    isOpen={isOpen}
                    size="full"
                >
                    <DrawerContent>
                        <SidebarNav
                            t={t}
                            mainPlatform={props.auth.main_platform}
                            onClose={onClose}
                            platform={props.auth.platform} />
                    </DrawerContent>
                </Drawer>
                <MobileNav {...props}
                    t={t}
                    platform={props.auth.platform}
                    i18n={i18n}
                    onOpen={onOpen}
                    currentLang={currentLang}
                />
                <Box
                    bg={useColorModeValue("gray.100", 'gray.800')}
                    ml={{ base: 0, md: 60 }}
                    overflowX={'scroll'}
                    minH='100vh'
                    p="4"
                    sx={{
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: "transparent",
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: useColorModeValue('gray.300', 'gray.700'),
                            borderRadius: 'full',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: useColorModeValue('gray.400', 'gray.600'),
                        },
                    }}
                >
                    {props.children}
                </Box>
            </Box>
        </CacheProvider>
    )
}