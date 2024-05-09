import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (route, status = "", categoryId = "", productId = "", searchText = "", page = 1, per_page = 4) => {
    const [data, setData] = useState([]);
    const [lastPage, setLastPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            let params = {
                page: page,
                per_page: per_page
            };

            if (searchText !== "") {
                params.search_query = searchText;
            } else {
                delete params.search_query;
            }

            if (status !== "") {
                params.status = status;
            } else {
                delete params.status;
            }
            if (categoryId !== "") {
                params.categoryId = categoryId;
            } else {
                delete params.categoryId;
            }
            if (productId !== "") {
                params.productId = productId;
            } else {
                delete params.productId;
            }
            try {
                const response = await axios.get(route, { params });
                setData(response.data.data.data);
                setLastPage(response.data.data.last_page)
                console.log(response);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, [route, searchText, status, categoryId, productId, page, per_page]);

    return { data, lastPage, isLoading };
};

export default useFetchData;
