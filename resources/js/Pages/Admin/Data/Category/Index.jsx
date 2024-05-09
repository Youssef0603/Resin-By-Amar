import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import ListingTable from "@/Components/Widgets/ListingTable.jsx";
import { Tag, TagLabel, Link, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
export default function Index(props) {
    const {t} = useTranslation()
    const columns = [
        {name: 'ID', sortable: true, selector: row => row.id},
        {name: t('name'), selector: row => row.name},
        {name: t('activity'), selector: row => row.active ?? "N/A",cell:
        (row) => (
            <Tag size="sm" p={1} borderRadius="full" variant={"solid"}  colorScheme={row.active?"green":"red"}>
                <TagLabel>{row.active ? t("active") : t("inactive")}</TagLabel>
            </Tag>
        ),},
    ];
    const filtersList = [
        {label:"created_at", name:'created_at', type:'input', input_type:'date',data:[]},
    ]
    return (
        <AuthenticatedLayout {...props}>
            <ListingTable
                {...props}
                columns={columns}
                filtersList={filtersList}
                title={t('categories')}
                baseEndPoint={'categories'}
            />
        </AuthenticatedLayout>
    );
}
