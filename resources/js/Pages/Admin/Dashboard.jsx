import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useTranslation } from 'react-i18next';

export default function Dashboard(props) {
    const { t } = useTranslation();
    console.log(props);
    return (
        <AuthenticatedLayout
            {...props}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('dashboard')}</h2>}
        >
        </AuthenticatedLayout>
    )
}