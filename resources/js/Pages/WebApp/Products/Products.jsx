import { Container, HStack, Heading, Select, Text, Grid, GridItem, Center, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import NavBar from '../Partials/Navbar'
import useFetchData from '@/Hooks/useFetchData';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/Components/WebApp/ProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Footer from '../Partials/Footer';
function Products(props) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);

    const [item, setItem] = useState(props.item ?? {});
    const categories = props.categories;
    const { data: products, lastPage } = useFetchData(route('products'), "", "", "", "", page, 12);

    const handleSelectedOption = (key, e) => {
        setItem({ ...item, [key]: e.target.value });
    }
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }
    const handleNextPage = () => {
        if (page < lastPage) {
            setPage(page + 1);
        }
    }
    return (
        <>
            <NavBar />
            <Container maxW={'1300px'}>
                <HStack alignItems={'center'} justifyContent={'space-between'} pt={20}>
                    <Heading fontWeight={'semi-bold'}>
                        Products
                    </Heading>
                    <Select placeholder={t('select_category')} value={item.category_id} onChange={(e) => handleSelectedOption('category_id', e)} width={'200px'}>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Select>
                </HStack>
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
            <Center pt={20}>
                <HStack>
                    <IconButton
                        icon={<ChevronLeftIcon color={'black'} fontSize={'30px'} />}
                        colorScheme={'transperant'}
                        onClick={() => handlePrevPage()}
                    />
                    <Text>{page}</Text>
                    <Text fontSize={'18px'} fontWeight={'bold'}>.....</Text>
                    <Text>{lastPage}</Text>

                    <IconButton
                        icon={<ChevronRightIcon color={'black'} fontSize={'30px'} />}
                        colorScheme={'transperant'}
                        onClick={() => handleNextPage()}
                    />
                </HStack>
            </Center>
            <Footer />
        </>
    )
}

export default Products
