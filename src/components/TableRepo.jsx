import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Button } from 'antd';
import moment from 'moment';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: value => {
            return value ? value : '-'
        }
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: value => {
            return value ? value : '-'
        }
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: value => {
            return value ? value : '-'
        }
    },
    {
        title: 'Number of Stars',
        dataIndex: 'stargazers_count',
        key: 'stars',
        render: number => {
            return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '-'
        }
    }
];

export default function TableRepo() {
    const [isLoading, setLoading] = useState(false);
    const lastMonth = moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD');
    const [dataTable, setDataTable] = useState([]);

    /* Obter dos users criados no ultimo mês, ordenado pelo número de estrelas, ordenado por ordem decrescente e filtrando apenas 5 resultados */
    const fetchData = () => {
        setLoading(true);
        fetch('https://api.github.com/search/repositories?q=webos+created%3A<' + lastMonth + '&sort=stars&order=desc&per_page=5')
            .then(response => response.json())
            .then(data => {
                setDataTable(data.items);
                setLoading(false);
            });
    }

    return (
        <div className="table-outer">
            <span className="table-title">Repositories Table</span>
            <Table columns={columns} dataSource={dataTable} pagination={{ hideOnSinglePage: true }} rowKey="id" />
            <Button id="hot_repo" loading={isLoading} onClick={() => fetchData()}>
                Update Table
            </Button>
        </div>
    );
}