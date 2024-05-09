import ProductCard from "@/Components/WebApp/ProductCard";
import useFetchData from "@/Hooks/useFetchData";
import { Heading, Flex, Grid, Text, GridItem } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
export default function Featured() {
    const { data: products } = useFetchData(route('products'), 'on-sale',);
    return (
        <>
            <Heading>
                Featured
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
        </>
    );
}