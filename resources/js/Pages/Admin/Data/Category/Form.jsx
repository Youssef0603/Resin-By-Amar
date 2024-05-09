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
    Textarea,
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

        router.post(route("admin.categories.store"), formData);
    }

    const handleBack = () => {
        router.get(route('admin.categories.index'))
    }

    const handleSelectedOption = (key, e) => {
        setItem({ ...item, [key]: e.target.value });
    }
    return (
        <AuthenticatedLayout {...props}>
            <Container maxW='container.lg' color='#262626' className={'pt-4'}>
                <Card>
                    <CardHeader>
                        <Heading size='md'>{item.id ? t("update_category") : t("new_category")}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>
                                <Heading className={'pb-4'} size='xs' textTransform='uppercase'>
                                    {t("general_info")}
                                </Heading>
                                <Grid templateColumns='repeat(1, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.name}>
                                            <FormLabel>{t("name_en")}</FormLabel>
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
                                </Grid>
                                <Grid templateColumns='repeat(1, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <FormControl isInvalid={errors.shop_description}>
                                            <FormLabel>{t('description')}</FormLabel>
                                            <Textarea
                                                id='description'
                                                name='description'
                                                placeholder={t('enter_category_description')}
                                                value={item.description ?? ''}
                                                onChange={(value) => handleInputChange(value)}
                                            />
                                            {errors.description &&
                                                <FormErrorMessage>{errors.description ?? ""}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>
                                </Grid>
                                <Grid templateColumns='repeat(1, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <FormControl>
                                            <FormLabel>{t('parent_category')}</FormLabel>
                                            <Select placeholder={t('select_category')} value={item.parent_id} onChange={(e) => handleSelectedOption('parent_id', e)}>
                                                {props.categories.map(category => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                </Grid>
                                <Grid templateColumns='repeat(1, 1fr)' gap={4} mt={3}>
                                    <GridItem w='100%'>
                                        <CustomFileUploader
                                            platform={'admin'}
                                            item={props.item?.media ?? {}}
                                            multiple={false}
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
