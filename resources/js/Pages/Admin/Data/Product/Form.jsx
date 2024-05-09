import {
    Box,
    Card,
    Grid,
    Input,
    Stack,
    Button,
    Heading,
    CardBody,
    GridItem,
    Container,
    CardHeader,
    CardFooter,
    FormControl,
    FormLabel,
    Select,
    Spacer,
    StackDivider,
    FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from "react";
import { router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from 'react-i18next';
import CustomFileUploader from '@/Components/Widgets/CustomFileUploader';

export default function Form(props) {
    const { errors } = props;
    const [item, setItem] = useState(props.item ?? {});
    const { t } = useTranslation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    }

    const handleSelectedOption = (key, e) => {
        setItem({ ...item, [key]: e.target.value });
    }
    const save = () => {
        let formData = new FormData();
        for (let key in item) {
            if (Array.isArray(item[key])) {
                item[key].forEach(file => {
                    formData.append(key + '[]', file);
                });
            } else if (typeof item[key] === 'object' && item[key] !== null) {
                if (item[key] instanceof FileList) {
                    Array.from(item[key]).forEach(file => {
                        formData.append(key + '[]', file);
                    });
                } else if (item[key] instanceof File) {
                    formData.append(key, item[key]);
                } else {
                    formData.append(key, JSON.stringify(item[key]));
                }
            } else {
                formData.append(key, item[key]);
            }
        }

        router.post(route("admin.products.store"), formData);
    }

    const handleBack = () => {
        router.get(route('admin.products.index'))
    }

    return (
        <AuthenticatedLayout {...props}>
            <Container maxW='container.lg' color='#262626' className={'pt-4'}>
                <Card>
                    <CardHeader>
                        <Heading size='md'>{item.id ? t("update_product") : t("new_product")}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>
                                <Heading className={'pb-4'} size='xs' textTransform='uppercase'>
                                    {t("general_info")}
                                </Heading>
                                <Grid templateColumns='repeat(2, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.name}>
                                            <FormLabel>{t("name")}</FormLabel>
                                            <Input name={'name'}
                                                id={'name'}
                                                type='text'
                                                placeholder={t("enter_name")}
                                                value={item.name ?? ''}
                                                onChange={(value) => handleInputChange(value)} />
                                            {errors.name_en &&
                                                <FormErrorMessage>{errors.name_en ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.description}>
                                            <FormLabel>{t("description")}</FormLabel>
                                            <Input name={'description'}
                                                id={'description'}
                                                type='text'
                                                placeholder={t("enter_description")}
                                                value={item.description ?? ''}
                                                onChange={(value) => handleInputChange(value)} />
                                            {errors.description &&
                                                <FormErrorMessage>{errors.description ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                </Grid>
                                <Grid templateColumns='repeat(2, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.cost}>
                                            <FormLabel>{t("cost")}</FormLabel>
                                            <Input name={'cost'}
                                                id={'cost'}
                                                type='number'
                                                placeholder={t("enter_cost")}
                                                value={item.cost ?? ''}
                                                onChange={(value) => handleInputChange(value)} />
                                            {errors.cost &&
                                                <FormErrorMessage>{errors.cost ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.price}>
                                            <FormLabel>{t("price")}</FormLabel>
                                            <Input name={'price'}
                                                id={'price'}
                                                type='number'
                                                placeholder={t("enter_price")}
                                                value={item.price ?? ''}
                                                onChange={(value) => handleInputChange(value)} />
                                            {errors.description &&
                                                <FormErrorMessage>{errors.description ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                </Grid>
                                <Grid templateColumns='repeat(2, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.category_id}>
                                            <FormLabel>{t("category")}</FormLabel>
                                            <Select placeholder={t('select_category')} value={item.category_id} onChange={(e) => handleSelectedOption('category_id', e)}>
                                                {props.categories.map(category => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </Select>
                                            {errors.category_id &&
                                                <FormErrorMessage>{errors.category_id ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.price}>
                                            <FormLabel>{t("price")}</FormLabel>
                                            <Select placeholder={t('select_status')} value={item.status_id} onChange={(e) => handleSelectedOption('status_id', e)}>
                                                {props.statuses.map(status => (
                                                    <option key={status.id} value={status.id}>{status.name}</option>
                                                ))}
                                            </Select>
                                            {errors.status_id &&
                                                <FormErrorMessage>{errors.status_id ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                </Grid>
                                <Grid templateColumns='repeat(1, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <CustomFileUploader
                                            platform={'admin'}
                                            item={props.item?.media ?? {}}
                                            multiple={true}
                                            keepUploader={false}
                                            label="Click here to upload"
                                            onChange={(files) => setItem({ ...item, media: files })}
                                        />
                                    </GridItem>
                                </Grid>
                            </Box>
                        </Stack>
                    </CardBody>
                    <CardFooter>
                        <Stack direction={'row'} width={'100%'}>
                            <Button type={'button'} onClick={handleBack}>{t("back")}</Button>
                            <Spacer />
                            <Button type={'button'} onClick={save} colorScheme='blue' variant='solid'>{t("save")}</Button>
                        </Stack>
                    </CardFooter>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
