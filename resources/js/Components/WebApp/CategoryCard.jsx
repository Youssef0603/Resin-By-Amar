'use client'

import { ReactElement } from 'react'
import { Box, SimpleGrid, Icon, Text, Stack, Flex, Image } from '@chakra-ui/react'
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc'
import { primaryColor } from '@/Constants/Colors'

const Feature = ({ title, image }) => {
    return (
        <Stack 
        style={{cursor:'pointer'}}
        alignItems={'center'}
        >
            <Flex
                w={20}
                h={20}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={primaryColor}
                mb={1}>
                <Image
                    src={image}
                    w={10}
                    h={10}
                />
            </Flex>
            <Text fontWeight={600} alignItems={'center'}>{title}</Text>
        </Stack>
    )
}

export default function CategoryCard(props) {
    return (
        <Box p={4} >
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                <Feature
                    image={props.image}
                    title={props.name}
                />
            </SimpleGrid>
        </Box>
    )
}