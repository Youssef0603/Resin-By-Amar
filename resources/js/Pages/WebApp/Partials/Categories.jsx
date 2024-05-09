import CategoryCard from "@/Components/WebApp/CategoryCard";
import useFetchData from "@/Hooks/useFetchData";
import { Heading, Flex, Grid, Text, GridItem } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
export default function Categories() {
    const { data: categories } = useFetchData(route('categories'));
    return (
        <>
            <Heading>
                Categories
            </Heading>


            <Grid templateColumns="repeat(4,2fr)">
                {categories.length > 0 && categories.map((category, index) => (
                    <>
                        <GridItem w='100%'>
                            <CategoryCard
                                key={index}
                                id={category.id}
                                name={category.name}
                                image={category.media && category.media.cdn}
                            />
                        </GridItem>
                    </>
                ))}
            </Grid>
        </>
    );
}