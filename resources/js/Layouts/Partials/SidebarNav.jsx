import React from 'react'
import {
    Avatar,
    Box,
    CloseButton,
    Flex,
    Icon,
    Text,
    Badge,
    useColorModeValue,
    background,
} from '@chakra-ui/react'
import {
    FiHome,
    FiAirplay,
    FiChrome,
    FiUser,
    FiUserCheck,
    FiCloudSnow,
    FiLock,
    FiPackage,
    FiUsers,
    FiRepeat,
    FiBell,
    FiCalendar,
    FiBox,
    FiLayers,
} from 'react-icons/fi'
import { FaBug } from "react-icons/fa";
import { TfiPulse } from "react-icons/tfi";
import { router, usePage } from '@inertiajs/react';

const GroupedNavItem = ({ group, items }) => {
    return (
        <Box mt="4">
            <Text fontWeight="bold" color="gray.500" fontSize="md" ml="6">{group}</Text>
            {items.map((item) => (
                <NavItem url={item.url} isBlank={item.isBlank} notifyOwner={item.notifyOwner} notifyAdmin={item.notifyAdmin} key={item.name} icon={item.icon}>
                    {item.name}
                </NavItem>
            ))}
        </Box>
    );
}

const NavItem = ({ icon, url, children, notifyAdmin, notifyOwner, isBlank, ...rest }) => {
    const currentUrl = route().current().includes(url.split(".")[1]);
    const activeNav = {
        background: "#718096",
        color: "white"
    }
    const handleOpenNewTab = () => isBlank ? window.open(route(url), '_blank') : router.visit(route(url));

    return (
        <Box onClick={handleOpenNewTab} style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p={2}
                ml={'4'}
                borderRadius="md"
                role="group"
                cursor="pointer"
                style={currentUrl ? activeNav : {}}
                _hover={{
                    bg: 'gray.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="2"
                        fontSize="15"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                <span style={{ fontSize: "15px" }}>
                    {children}
                    {
                        notifyAdmin && (
                            <Badge ml='1' colorScheme='green'>
                                New
                            </Badge>
                        )
                    }
                </span>
            </Flex>
        </Box>
    )
}

const SidebarNav = ({ onClose, t, platform, mainPlatform, ...props }) => {
    const adminLinkItems = [
        { name: t('home'), icon: FiHome, url: 'admin.dashboard', group: 'main' },
        {
            name: t('data'), group: t('data'), items: [
                { name: t('categories'), icon: FiBell, url: 'admin.categories.index'},
                { name: t('products'), icon: FiBell, url: 'admin.products.index'},

            ]
        },
    ];

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            pb={10}
            overflowY={"scroll"}
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
            {...props}
        >
            <Flex h="20" my={1} alignItems="center" mx="10" justifyContent="space-between">
                <Avatar align='center' alignSelf={'center'} src={"/images/app/resinbyamarlogo.jpeg"} w={"auto"} />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {
                adminLinkItems.map((link) => (
                    link.items ? (
                        <GroupedNavItem key={link.name} isBlank={link.isBlank} group={link.group} items={link.items} />
                    ) : (
                        <NavItem url={link.url} isBlank={link.isBlank} key={link.name} icon={link.icon}>
                            {link.name}
                        </NavItem>
                    )))
            }
        </Box>
    );
}
export default SidebarNav;