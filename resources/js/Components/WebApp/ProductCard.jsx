'use client'

import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
    Text
} from '@chakra-ui/react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'
import { router } from '@inertiajs/react';


function Rating({ rating, numReviews }) {
    return (
        <Box display="flex" alignItems="center">
            {Array(5)
                .fill('')
                .map((_, i) => {
                    const roundedRating = Math.round(rating * 2) / 2
                    if (roundedRating - i >= 1) {
                        return (
                            <BsStarFill
                                key={i}
                                style={{ marginLeft: '1' }}
                                color={i < rating ? 'teal.500' : 'gray.300'}
                            />
                        )
                    }
                    if (roundedRating - i === 0.5) {
                        return <BsStarHalf key={i} style={{ marginLeft: '1' }} />
                    }
                    return <BsStar key={i} style={{ marginLeft: '1' }} />
                })}
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {numReviews} review{numReviews > 1 && 's'}
            </Box>
        </Box>
    )
}

function ProductCard(props) {
    const data = props;
    return (
        <Flex mt={20} w="full" alignItems="center" >
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                maxW="sm"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                position="relative"
                onClick={() => router.get(route('products.show', { id: data.id }))}
                _hover={{
                    cursor: 'pointer',
                }}
            >
                {/* {data.isNew && (
                    <Circle size="10px" position="absolute" top={2} right={2} bg="green.200" />
                )} */}
                {data.discount &&
                    <Text
                        position="absolute"
                        top={1}
                        right={5}
                        fontWeight={'semi-bold'}
                        fontSize={'25px'}
                        color={'teal'}
                    >
                        {"%" + data.discount}
                    </Text>
                }

                <Image src={data.imageUrl} alt={`Picture of ${data.title}`} roundedTop="lg" height={'300px'} width={'300px'} />

                <Box p="6">
                    <Box display="flex" alignItems="baseline">
                        {data.isNew && (
                            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="green">
                                New
                            </Badge>
                        )}
                    </Box>
                    <Box
                        fontSize="2xl"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated>
                        {data.title}
                    </Box>
                    <Box
                        fontSize="xm"
                        fontWeight="semibold"
                        lineHeight="tight"
                        isTruncated>
                        {data.subTitle}
                    </Box>
                    <Flex justifyContent="end" alignContent="center">
                        {data.discount &&
                            <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')} as='del'>
                                <Box as="span" color={'gray.600'} fontSize="lg">
                                    $
                                </Box>
                                {data.price}
                            </Box>}
                        <Box ml={5} fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                            <Box as="span" color={'gray.600'} fontSize="lg">
                                $
                            </Box>
                            {(data.price * (100 - data.discount) / 100)}
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    )
}

export default ProductCard