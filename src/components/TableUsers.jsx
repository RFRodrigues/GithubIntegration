import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Table, Avatar, Button, notification } from 'antd';
import moment from 'moment';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: id => {
            return id ? id : '-'
        }
    },
    {
        title: 'Login',
        dataIndex: 'login',
        key: 'login',
        render: login => {
            return login ? login : '-'
        }
    },
    {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render: link => {
            return link ? <Avatar src={link} /> : '-'
        }
    },
    {
        title: 'Followers',
        dataIndex: 'followers',
        key: 'followers',
        render: number => {
            return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '-'
        }
    }
];

export default function TableRepo() {
    const [isLoading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [autoUpdate, setAutoUpdate] = useState(false);
    const lastYear = moment(new Date()).subtract(1, 'years').format('YYYY-MM-DD');
    const interval = 120000;

    useEffect(() => {
        if (autoUpdate) {
            setInterval(() => {
                fetchData();
            }, interval);
        }
    }, [autoUpdate]);

    /* Prevenção para que nunca fique loading infinito, sendo que ao fim de 3 segundos, o loading é terminado */
    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        }
    }, [isLoading]);

    /* Obter dos users criados no ultimo ano, ordenado pelo número de followers, ordenado por ordem decrescente e filtrando apenas 5 resultados */
    const fetchData = () => {
        let elements = [];

        setLoading(true);
        fetch('https://api.github.com/search/users?q=created%3A%3C' + lastYear + '&sort=followers&order=desc&per_page=5')
            .then(response => response.json())
            .then(data => {
                if (!data.items) {
                    showMessage('Error', 'An Error occured while trying to get data from server. Please try again in a few seconds.', 'Error');
                }
                else {
                    data.items.forEach((element) => {
                        elements.push({
                            id: element.id,
                            login: element.login,
                            avatar: element.avatar_url
                        });
                    });
                }
                setLoading(false);
            }).then(() => fetchFollowers(elements))
    }

    /* Obter  a informação dos followers */
    const fetchFollowers = ((dataTableTemp) => {

        let promises = [];

        setLoading(true);
        console.log(dataTableTemp);
        if (dataTableTemp.length > 0) {
            for (let i = 0; i < dataTableTemp.length; i++) {
                promises.push(fetch('https://api.github.com/users/' + dataTableTemp[i].login)
                    .then(response =>
                        response.json()
                            .then(data => {
                                dataTableTemp[i].followers = data.followers;
                            }))
                    .catch((error) => {
                        console.log(error);
                    }));
            }

            Promise.all(promises)
                .then(() => {
                    setDataTable(dataTableTemp);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
            setAutoUpdate(true);
        }
    });

    /* Setup notificação de erro ou warning */
    const showMessage = (message, description, type) => {
        const args = {
            message: message,
            description: description,
            duration: 5,
        };
        type === 'Error' ? notification.error(args) : notification.warning(args);
    };

    return (
        <div className="table-outer">
            <span className="table-title">Users Table</span>
            <Table columns={columns} dataSource={dataTable} pagination={{ hideOnSinglePage: true }} rowKey="id" />
            <Button id="prolific_users" loading={isLoading} onClick={() => fetchData()}>
                Update Table
            </Button>
        </div>
    );
}