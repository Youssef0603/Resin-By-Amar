import { Grid,GridItem,Text,Image } from "@chakra-ui/react";
import NoDataFound from "/public/landing/assets/img/3371471-removebg-preview.png"
export default function NothingFound({type}) {
    return (
        <Grid className={'justify-items-center'}>
            <GridItem>
                <Image
                    boxSize={'150px'}
                    src={NoDataFound}
                    alt='no-data-found'
                />
            </GridItem>
            <GridItem className={'text-center'}>
                <Text fontSize={'xl'}>
                   Nothing Found
                </Text>
            </GridItem>
        </Grid>
    )
}