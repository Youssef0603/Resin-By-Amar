import { Container, HStack, Image, Grid, GridItem, Text, VStack, Box, useColorModeValue, Tag, Button, Heading } from "@chakra-ui/react";
import NavBar from "../Partials/Navbar";
import { FaWhatsapp } from "react-icons/fa";
import useFetchData from "@/Hooks/useFetchData";
import ProductCard from "@/Components/WebApp/ProductCard";
import Carousel from "@/Components/WebApp/Carousel";
import Footer from "../Partials/Footer";
function ProductDetails(props) {
    const item = props.item;
    const { data: products } = useFetchData(route('get-products-category'), "", item.category_id, item.id);
    return (
        <>
            <NavBar />
            <Container maxW='1200px'>
                <HStack pt={10} spacing={'50px'} alignItems={'start'}>
                    <Carousel
                        images={item.medias}
                    />
                    <VStack alignItems={'left'} spacing={'30px'}>
                        <Text
                            fontSize={'14px'}
                            color={'gray.500'}>
                            {item.category.name}
                        </Text>
                        <Text
                            fontSize={'30px'}
                            fontWeight={'bold'}
                        >
                            {item.name + " " + item.description}
                        </Text>
                        <Text fontSize={'18px'} color={'gray.600'}>
                            {item.category.description}
                        </Text>
                        <HStack justifyContent="start" alignContent="center">
                            {item.discount &&
                                <>
                                    <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')} as='del'>
                                        <Box as="span" color={'gray.600'} fontSize="lg">
                                            $
                                        </Box>
                                        {item.price}
                                    </Box><Box ml={5} fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                                        <Box as="span" color={'gray.600'} fontSize="lg">
                                            $
                                        </Box>
                                        {(item.price * (100 - item.discount) / 100)}
                                    </Box>
                                </>
                            }
                            {!item.discount &&
                                <>
                                    <Box ml={5} fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                                        <Box as="span" color={'gray.600'} fontSize="lg">
                                            $
                                        </Box>
                                        {item.price}
                                    </Box>
                                </>
                            }
                            <Tag ml={5} variant={'outline'} colorScheme={item.status.slug === 'on-sale' ? 'blue' : item.status.slug === 'out-of-stock' ? 'red' : 'gray'}>
                                {item.status.name}
                            </Tag>
                        </HStack>
                        <Text>Order via whatsapp:</Text>
                        <Button leftIcon={<FaWhatsapp />} colorScheme={'teal'}>Order</Button>
                    </VStack>
                </HStack>
         
                
            </Container>
            <Container maxW={'1300px'}>
            <Heading pt={20} fontWeight={'semi-bold'}>
                    U May Also Like
                </Heading>
            <Grid templateColumns="repeat(4,2fr)">
                    {products.length > 0 && products.map((product, index) => (
                        <>
                            <GridItem w='100%' key={index}>
                                <ProductCard
                                    key={index}
                                    id={product.id}
                                    title={product.name}
                                    subTitle={product.description}
                                    imageUrl={product.medias[0].cdn}
                                    price={product.price}
                                    discount={product.discount ?? ''}
                                />
                            </GridItem>
                        </>
                    ))}
                </Grid>
            </Container>
            <Box pt={20} />
            <Footer />
        </>
    );
}

export default ProductDetails;