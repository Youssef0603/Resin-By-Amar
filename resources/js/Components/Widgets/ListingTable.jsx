import DataTable, { createTheme } from 'react-data-table-component';
import { useEffect, useState, useRef, useContext } from "react";
import {
    Box,
    Flex,
    Card,
    Text,
    Grid,
    Image,
    Button,
    Drawer,
    Spacer,
    Heading,
    GridItem,
    CardBody,
    DrawerBody,
    ButtonGroup,
    DrawerHeader,
    DrawerContent,
    DrawerCloseButton,
    DrawerOverlay,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Hide,
    Select as ChakraSelect,
    Stack,
    Input,
    FormControl,
    HStack,
    InputGroup,
    InputLeftElement,
    Tag,
    TagLabel,
    TagCloseButton,
    Menu,
    MenuButton,
    MenuList,
    Icon,
    Link,
    Spinner,
    Portal,
    StackDivider,
    useColorMode
} from "@chakra-ui/react";
import { router } from "@inertiajs/react";
import {
    DownloadIcon,
    PlusSquareIcon,
    ViewIcon,
    SearchIcon
} from "@chakra-ui/icons";
import { TbReload } from "react-icons/tb";
import { useColorModeValue } from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';
import NoDataFound from "/public/landing/assets/img/3371471-removebg-preview.png"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BsThreeDotsVertical } from "react-icons/bs";
import useDebounce from '@/Hooks/useDebounce';

import { IoReloadCircle } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import NothingFound from './NothingFound';
import { FormLabel } from 'react-bootstrap';


const animatedComponents = makeAnimated();

export default function ListingTable({ columns, baseEndPoint, title, filtersList, ...props }) {
    const { auth } = props;
    const [url, setUrl] = useState(null);
    const [data, setData] = useState([]);
    const [userType, setUserType] = useState(null); // 'admin'
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedId, setSelectedId] = useState(null);
    const [confirmDialogState, setConfirmDialogState] = useState(false);
    const cancelRef = useRef()
    const { colorMode } = useColorMode();
    const [parsedColumns, setParsedColumns] = useState([]);
    const [searchIsLoading, setSearchIsLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [selectedFiltersLabels, setSelectedFiltersLabels] = useState([])
    const [filterUpdated, setFilterUpdated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debounceSearchQuery = useDebounce(searchQuery, 500);
    const { t } = useTranslation();

    const multiSelectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: colorMode == 'light' ? 'transparent' : "#2D3748"
        }),
        option: (base, state) => ({
            ...base,

            backgroundColor:
                colorMode == "light" ?
                    (state.isSelected ? 'transparent' : 'white')
                    : (state.isSelected ? '#2d3748' : '#1a202c'),
            color: state.isSelected ? 'gray' : base.color,
            cursor: 'pointer',
            ':hover': {
                backgroundColor: colorMode == 'light' ? '#f0f0f0' : "#718096",
            },
        }),

        multiValue: (base, state) => ({
            ...base,
            backgroundColor: colorMode === 'light' ? '#CBD5E0' : '#171923',
            color: colorMode === 'light' ? 'black' : "white"

        }),
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: colorMode === 'light' ? 'black' : "white",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: colorMode == 'dark' ? "#1a202c" : "white",
        }),
    }

    createTheme('dark', {
        text: {
            primary: '#FFFFFF',
            secondary: '#B2B2B2',
        },
        background: {
            default: '#2D3748',

        },
        action: {
            disabled: 'rgba(255, 255, 255, 0.12)'
        }
    });
    useEffect(() => {
        let parsedUserType = 'admin';
        let parsedUrl = `${parsedUserType}.${baseEndPoint}.list`;
        
        setUserType(parsedUserType);
        setUrl(parsedUrl);

        let actionsColumn = props.haveActions ?? {
            name: t("actions"), button: "true", cell: row => {
                return (
                    <Menu direction="rtl">
                        <MenuButton style={{ outline: 'none' }} transition="all 0.3s" >
                            <HStack>
                                <Icon boxSize={4} aria-label="open menu" as={BsThreeDotsVertical} />
                            </HStack>
                        </MenuButton>
                        <Portal>
                            <MenuList>
                                <Stack divider={<StackDivider />} spacing='1'>
                                    {props.canEdit ??<Box px={3}>
                                        <a href={route(`${parsedUserType}.${baseEndPoint}.edit`, [{ id: row.id }])} className="text-blue-600 hover:text-blue-900">{t("edit")}</a>
                                    </Box>}
                                    
                                    {props.canDelete ?? <Box px={3}>
                                        <button onClick={() => openDialog(row.id)} className="text-red-600 hover:text-red-900">{t("delete")}</button>
                                    </Box>}
                                    {props.canActivate ??
                                        <Box px={3}>
                                            <button onClick={() => toggleActive(row.id)} className="text-green-600 hover:text-blue-900">{row.active == 1 ? t("deactivate") : t("activate")}</button>
                                        </Box>}
                                </Stack>
                            </MenuList>
                        </Portal>
                    </Menu>
                )
            },
        };

        setParsedColumns([...columns, actionsColumn]);

        if (url != null) {
            fetchData(1); // fetch page 1 of users
        }

        if (Object.keys(filters).length > 0 && filterUpdated == true) {
            fetchData();
        }

    }, [url, filterUpdated, filters, debounceSearchQuery, localStorage.getItem("lang")]);
    const toggleActive = (id) => {
        axios.post(route(`${userType}.${baseEndPoint}.toggle-active`, [{ id: id }]))
            .then((response) => {
                fetchData();
                console.log(response)
            })
    }

    const openDialog = (id) => {
        setConfirmDialogState(true);
        setSelectedId(id);
    }

    const closeDialog = () => {
        setConfirmDialogState(false);
        setSelectedId(null);
    }

    const handleItemDeletion = () => {
        router.visit(route(`${userType}.${baseEndPoint}.destroy`, [{ id: selectedId }]),
            {
                preserveScroll: true,
                method: 'delete',
                onSuccess: () => {
                    setConfirmDialogState(false);
                },
            })
    }

    const handlePageChange = page => {
        fetchData(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const response = await axios.get(route(url), {
            params: {
                page: page,
                per_page: newPerPage,
            }
        });

        setData(response.data.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    const handleFilterInputChange = (e, filterName, type) => {
        if (type == 'multi-select') {
            let values = filters[filterName] ?? [];
            let labels = selectedFiltersLabels[filterName] ?? [];
            let action = e.action;
            let option = action == 'select-option' ? e.option : e.removedValue;

            if (action == 'select-option') {
                values.push(option.value);
                labels.push(option.label);
            } else {
                let valueIndex = values.indexOf(option.value);
                let labelIndex = labels.indexOf(option.label);
                values.splice(valueIndex, 1);
                labels.splice(labelIndex, 1);
            }
            setFilters({ ...filters, [filterName]: values });
            setSelectedFiltersLabels({ ...selectedFiltersLabels, [filterName]: labels });

        } else if (type == 'single-select') {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const dataLabel = selectedOption.getAttribute('data-label');

            setFilters({ ...filters, [e.target.name]: e.target.value });
            setSelectedFiltersLabels({ ...selectedFiltersLabels, [e.target.name]: dataLabel });
        }
        else {
            setFilters({ ...filters, [e.target.name]: e.target.value });
            setSelectedFiltersLabels({ ...selectedFiltersLabels, [e.target.name]: e.target.value });
        }
    }

    const fetchData = async (page, type = 'list') => {
        setLoading(true);
        let params = {
            page: page,
            per_page: perPage,
        }

        if (Object.keys(filters).length > 0) {
            params.filters = JSON.stringify(filters)
        } else {
            delete params.filters;
        }

        if (searchQuery !== "") {
            setSearchIsLoading(true)
            params.search_query = debounceSearchQuery;
        } else {
            delete params.search_query;
        }

        if (type == 'refresh') {
            delete params.filters;
            delete params.search_query;
            setSelectedFiltersLabels([])
            setFilters({})
            setSearchQuery("")
            setSearchIsLoading(false)
        }

        await axios.get(route(url), {
            params: params
        }).then(response => {
            setData(response.data.data.data);
            setTotalRows(response.data.data.total);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
            setFilterUpdated(false)
            setSearchIsLoading(false)
        });

    };

    const handleRemoveFilter = async (type, index) => {
        const updatedLabels = { ...selectedFiltersLabels };
        const updatedValues = { ...filters };

        if (Array.isArray(updatedLabels[type])) {
            updatedLabels[type] = updatedLabels[type].filter((_, i) => i !== index)
        } else {
            delete updatedLabels[type];
        }

        if (Array.isArray(updatedValues[type])) {
            updatedValues[type] = updatedValues[type].filter((_, i) => i !== index)
        } else {
            delete updatedValues[type];
        }

        if (Array.isArray(updatedValues[type]) && updatedValues[type].length == 0) {
            delete updatedValues[type];
            delete updatedLabels[type];
        }

        setSelectedFiltersLabels(updatedLabels);
        setFilters(updatedValues);
        setFilterUpdated(true);
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    }

    return (
        <div>
            <Flex minWidth='max-content' alignItems='center' gap='2' className={'mb-4'}>
                <Box p='2'>
                    <Heading size={{ base: 'sm', sm: 'md' }}>{t(title.toLowerCase())}</Heading>
                </Box>
                <Spacer />
                <ButtonGroup gap='1'>
                    <Button
                        size={'sm'}
                        colorScheme='gray'
                        isDisabled={!!props.forceCanAdd}
                        leftIcon={<PlusSquareIcon />}
                        onClick={() => {
                            const targetRoute = route(`${userType}.${baseEndPoint}.create`);
                            console.log(targetRoute)
                            router.visit(targetRoute)
                        }}
                    >
                        <Hide below='sm'>
                            <Box>{t("create")}</Box>
                        </Hide>
                    </Button>
                    <Button leftIcon={<TbReload />} size={'sm'} colorScheme='gray' onClick={() => fetchData(1, 'refresh')}>
                        <Hide below='sm'>
                            <Box>{t("refresh")}</Box>
                        </Hide>
                    </Button>
                    <Button leftIcon={<DownloadIcon />} size={'sm'} colorScheme='gray'>
                        <Hide below='sm'>
                            <Box>{t("export")}</Box>
                        </Hide>
                    </Button>
                    <Button leftIcon={<ViewIcon />} size={'sm'} colorScheme='gray' onClick={onOpen}>
                        <Hide below='sm'>
                            <Box >{t("filter")}</Box>
                        </Hide>
                    </Button>
                </ButtonGroup>
            </Flex>
            <Drawer
                size={'sm'}
                placement={localStorage.getItem('lang') == 'en' ? 'right' : 'left'}
                onClose={onClose}
                isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px' bg={useColorModeValue('white', 'gray.900')}>{t("choose_filter")}</DrawerHeader>
                    <DrawerBody bg={useColorModeValue('white', 'gray.800')}>
                        <Stack spacing={4} align="stretch">
                            <Box>
                                {filtersList && filtersList.length > 0 && filtersList.map((filter, index) => {
                                    return (
                                        <Grid mb={4} key={index} templateColumns={'repeat(1,1fr)'} mt={1}>
                                            <GridItem w="100%">
                                                <FormControl>
                                                    <FormLabel>{t(filter.label) ?? "Label"}</FormLabel>

                                                    {filter.type == 'input' &&
                                                        <Input
                                                            name={filter.name}
                                                            id={filter.name}
                                                            bg={useColorModeValue("white", "gray.700")}
                                                            placeholder={filter.placeholder}
                                                            type={filter.input_type ?? 'text'}
                                                            value={filters[filter.name] ?? ''}
                                                            onChange={(value) => handleFilterInputChange(value, filter.name, filter.type)}
                                                        />}

                                                    {filter.type == 'single-select' &&
                                                        <ChakraSelect
                                                            value={filters[filter.name] ?? ''}
                                                            placeholder={(filter.placeholder)}
                                                            bg={useColorModeValue("white", "gray.700")}
                                                            name={filter.name}
                                                            onChange={(value) => handleFilterInputChange(value, filter.name, filter.type)}
                                                        >
                                                            {filter.data && filter.data.length > 0 &&
                                                                filter.data.map((item) => <option data-label={item.label} value={item.value} key={item.value}>{item.label}</option>)}
                                                        </ChakraSelect>}

                                                    {filter.type == 'multi-select' &&
                                                        <Select
                                                            value={(selectedFiltersLabels[filter.name] || []).map((label) => ({ label: label }))}
                                                            onChange={(value, data) => handleFilterInputChange(data, filter.name, filter.type)}
                                                            isOptionDisabled={(option) => (filters[filter.name] || []).includes(option.value)}
                                                            hideSelectedOptions={false}
                                                            options={filter.data ?? []}
                                                            closeMenuOnSelect={false}
                                                            isClearable={false}
                                                            components={{
                                                                MultiValueRemove: (props) => (
                                                                    <Box {...props.innerProps}
                                                                        _hover={{ cursor: 'pointer' }}
                                                                        onClick={() => handleRemoveFilter(filter.name, selectedFiltersLabels[filter.name].indexOf(props.data.label))}>
                                                                        &times;
                                                                    </Box>
                                                                ),
                                                            }}
                                                            styles={multiSelectStyles}
                                                            isMulti
                                                        />
                                                    }
                                                </FormControl>
                                            </GridItem>
                                        </Grid>
                                    )
                                })}
                            </Box>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <AlertDialog
                isOpen={confirmDialogState}
                leastDestructiveRef={cancelRef}
                onClose={closeDialog}
                motionPreset='slideInBottom'
                isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete {title}
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef}
                                size={'sm'} onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button
                                size={'sm'}
                                colorScheme='red'
                                onClick={handleItemDeletion}
                                ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Card>
                <CardBody>
                    <HStack mb={4}>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none' >
                                {searchIsLoading ?
                                    <Spinner />
                                    :
                                    <SearchIcon color='gray.300' />
                                }
                            </InputLeftElement>
                            <Input type='search' value={searchQuery ?? ""} variant='filled' borderRadius={'2xl'} placeholder={t("search")} onChange={handleSearchInputChange} />
                        </InputGroup>
                    </HStack>
                    {Object.keys(filters).length > 0 && (
                        <HStack spacing={4} mb={3}>
                            <Text fontWeight="bold">Filters:</Text>
                            {Object.keys(filters).map((type) => (
                                <Box key={type}>
                                    {(Array.isArray(selectedFiltersLabels[type]) ? selectedFiltersLabels[type] : [selectedFiltersLabels[type]]).map((item, index) => (
                                        <Tag key={index} size="sm" py={"2px"} ml={1} borderRadius="full" variant="subtle" colorScheme="teal">
                                            <TagLabel>{type.charAt(0).toUpperCase() + type.slice(1).replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); })}
                                                : {item}</TagLabel>
                                            <TagCloseButton onClick={() => handleRemoveFilter(type, index)} />
                                        </Tag>
                                    ))}
                                </Box>
                            ))}
                        </HStack>
                    )}
                    {

                        data.length > 0 &&
                        <DataTable
                            striped={colorMode == 'dark' ? false : true}
                            dense
                            theme={colorMode}
                            responsive
                            highlightOnHover
                            pagination
                            data={data}
                            paginationServer
                            columns={parsedColumns}
                            progressPending={loading}
                            onChangePage={handlePageChange}
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowsChange}
                        />
                    }
                    {
                        data.length === 0 &&
                        <NothingFound type={"table"} />
                    }
                </CardBody>
            </Card>
        </div>
    );
}
