import { useState, useEffect } from 'react';
import {
    Flex,
    IconButton,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    Stack,
    StackDivider,
    Switch,
    Text,
    Button,
    Avatar,
    VStack,
    WrapItem,
    Heading,
    MenuItem,
    Badge,
    Icon,
    Box,
    Link,
    MenuDivider,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react';
import {
    FiHome,
    FiMenu,
    FiBell,
    FiChevronDown,
    FiUsers,
    FiMessageSquare,
    FiMap,
    FiUser,
    FiAirplay,
    FiAnchor,
    FiPercent,
    FiArchive,
    FiChrome,
    FiSettings,
    FiSun,
    FiMoon,
    FiLogOut,
    FiCloudSnow,
    FiBellOff
} from 'react-icons/fi'
import { IoArrowUndo } from "react-icons/io5";
import { router } from '@inertiajs/react';
import { IoLanguage } from "react-icons/io5";
import { RiEnglishInput } from "react-icons/ri";
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';
import { formatNotificationDate } from "@/Utils/DateTimeUtils"
const MobileNav = ({ auth, onOpen, currentLang, t, i18n, notifyUser, ...props }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [lang, setLang] = useState(currentLang);
    const [dir, setDir] = useState(currentLang == 'ar' ? 'rtl' : 'ltr');
    const bg = useColorModeValue('white', 'gray.900');
    const hoverBg = useColorModeValue('gray.100', 'gray.800');
    const toggleLang = () => {
        const htmlTag = document.getElementById('htmlTag');

        const currentDir = htmlTag.getAttribute('dir');
        const currentLng = htmlTag.getAttribute('lang');

        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        const newLang = currentLng === 'ar' ? 'en' : 'ar'

        localStorage.setItem('lang', newLang);
        i18n.changeLanguage(newLang)

        setLang(newLang);
        setDir(newDir);
    };

    useEffect(() => {
        htmlTag.setAttribute('lang', lang);
        htmlTag.setAttribute('dir', dir);
    }, [lang, dir])

    const handleLogout = () => {
        router.post(route('logout'))
    }


    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={bg}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={'end'}
            {...props}>

            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Resin By Amar
            </Text>

            <HStack spacing={{ base: '0', md: '2' }}>
                <Flex alignItems={'center'}>
                    <HStack spacing={1}>
                        <Switch
                            isChecked={lang === 'ar'}
                            onChange={toggleLang}
                            colorScheme={"blue"}
                            size="sm"
                        />
                        {lang == 'ar' ? <IoLanguage /> : <RiEnglishInput />}
                    </HStack>
                </Flex>

                <Flex alignItems={'center'}>
                    <Button
                        as={motion.button}
                        key={colorMode}
                        initial="hidden"
                        animate={'visible'}
                        variants={{
                            hidden: { opacity: 0, scale: 0.5 },
                            visible: { opacity: 1, scale: 1, rotate: 360 },
                        }}
                        transition="0.2s linear"
                        size="md"
                        variant="ghost"
                        _hover={{ bg: 'transparent' }}
                        onClick={toggleColorMode}>
                        {colorMode === 'dark' ? <FiMoon /> : <FiSun />}
                    </Button>
                </Flex>


                <Flex alignItems={'center'}>
                    <Menu bg={bg}>
                        <MenuButton py={2} style={{ outline: 'none' }} transition="all 0.3s">
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={'/images/defaults/female-avatar.svg'} />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                >
                                    <Text fontSize="sm" mb={0}>
                                        {auth.user.name}
                                    </Text>
                                    <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.300')} mb={0}>
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList bg={bg} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem
                                icon={<FiUser />}
                                bg={bg}
                                _hover={{ bg: hoverBg }}
                                onClick={() => router.get(route('profile.edit'))}
                            >
                                {t("profile")}
                            </MenuItem>
                            <MenuItem
                                icon={<FiSettings />}
                                bg={bg}
                                _hover={{ bg: hoverBg }}
                                onClick={() => {}}
                            >
                                {t('settings')}
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                                icon={<FiLogOut />}
                                bg={bg}
                                _hover={{ bg: hoverBg }}
                                onClick={handleLogout}
                            >
                                {t('sign_out')}
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}
export default MobileNav;
