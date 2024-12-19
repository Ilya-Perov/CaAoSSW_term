// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Empty, List, Button, Space, Modal, Input, Form } from 'antd';
import axios from 'axios';
import StreamCard from "./components/StreamCard.jsx";
const App = () => {
    const API_URL = "http://localhost";
    const [streams, setStreams] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [newStream, setNewStream] = useState({ name: '', description: '', preview: '', link: '' });
    const [username, setUsername] = useState('');

    const getStreams = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/streams`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStreams(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Ошибка: неавторизованный доступ. Пожалуйста, войдите в систему.');
                } else if (error.response.status === 402) {
                    alert('Ошибка: требуется платеж.');
                } else {
                    alert('Ошибка при получении стримов.');
                }
            } else {
                alert('Ошибка сети. Попробуйте позже.');
            }
        }
    };

    const onStreamUpdated = () => {
        getStreams(); // Обновляем список стримов
    };

    const onStreamDeleted = () => {
        getStreams(); // Обновляем список стримов
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');
        if (token) {
            setIsLoggedIn(true);
            if (savedUsername) setUsername(savedUsername);
            
        }
        getStreams();
    }, []);

    const handleLogin = async (values) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', values.username);
            formData.append('password', values.password);

            const response = await axios.post(`${API_URL}/api/auth/token`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            // Обработка успешного ответа
            if (response.data.access_token) {
                setIsLoggedIn(true);
                setUsername(values.username);
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('username', values.username);
                setIsLoginModalVisible(false);
                getStreams();
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error.response.data);
            alert('Ошибка авторизации: неверное имя пользователя или пароль.');
        }
    };

    const handleRegister = async (values) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                username: values.username, // Логин
                password: values.password, // Пароль
                email: values.email // Электронная почта
            });

            if (response.status === 200) {
                alert('Регистрация успешна! Перейдите по ссылке в письме на Вашей почте, чтобы закончить регистрацию');
                setIsRegisterModalVisible(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error.response.data);
            alert('Ошибка регистрации: ' + (error.response.data.detail || 'Пожалуйста, попробуйте позже.'));
        }
    };

    const handleAddStream = async (values) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}/api/streams`, {
                name: values.name,
                description: values.description,
                preview: values.preview,
                link: values.link
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.ok) {
                getStreams(); // Обновите список стримов после успешного добавления
                setNewStream({ name: '', description: '', preview: '', link: '' });
                setIsModalVisible(false);
            } else {
                alert(response.data.message || 'Ошибка при добавлении стрима.');
            }
        } catch (error) {
            console.error("Ошибка добавления стрима:", error.response.data);
            alert('Ошибка добавления стрима: '+error.response.data.detail);
        }
    };

    const showModal = (stream) => {
        setSelectedStream(stream);
        setIsModalVisible(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    return (
        <div style={{ padding: '20px', position: 'relative', backgroundColor:'darkgray' }}>
            {isLoggedIn && <div style={{ position: 'absolute', top: 18, left: 18, fontWeight: 'bold' }}>Добрый день, {username}!</div>}
            <Space style={{ marginBottom: '20px', float: 'right' }}>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Новое видео
                </Button>
                {!isLoggedIn ? (
                    <>
                        <Button onClick={() => setIsRegisterModalVisible(true)}>Регистрация</Button>
                        <Button onClick={() => setIsLoginModalVisible(true)}>Авторизация</Button>
                    </>
                ) : (
                    <Button onClick={handleLogout}>Выйти</Button>
                )}
            </Space>

            {/* List Container */}
            <div style={{ clear: 'both', backgroundColor: 'lightgray'}}>
                {streams.length === 0 ? (
                    <Empty
                        description={<span style={{ fontSize: '24px', fontWeight: 'bold', textAlign:'center'}}>Здесь пока пусто...<br/>Давайте что-нибудь посмотрим</span>}
                    />
                ) : (
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={streams}
                        renderItem={(stream) => (
                            <List.Item>
                                <StreamCard
                                    stream={stream}
                                    onClick={() => showModal(stream)}
                                    onStreamDeleted={onStreamDeleted}
                                    onStreamUpdated={onStreamUpdated}
                                />
                            </List.Item>
                        )}
                    />
                )}

                {/* Registration Modal */}
                <Modal
                    title="Регистрация"
                    open={isRegisterModalVisible}
                    onCancel={() => setIsRegisterModalVisible(false)}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Form
                        name="register"
                        onFinish={handleRegister}
                        layout="vertical"
                    >
                        <Form.Item
                            placeholder="Электронная почта"
                            label="Электронная почта"
                            name="email"
                            rules={[
                                { required: true, message: 'Введите электронную почту...' },
                                { type: 'email', message: 'Пожалуйста, введите корректный адрес электронной почты вида: example@example.com' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            placeholder="Имя пользователя"
                            label="Имя пользователя"
                            name="username"
                            rules={[{ required: true, message: 'Введите имя пользователя...' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            placeholder="Пароль"
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Введите пароль...' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Login Modal */}
                <Modal
                    title="Авторизация"
                    open={isLoginModalVisible}
                    onCancel={() => setIsLoginModalVisible(false)}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Form
                        name="login"
                        onFinish={handleLogin}
                        layout="vertical"
                    >
                        <Form.Item
                            placeholder="Имя пользователя"
                            label="Имя пользователя"
                            name="username"
                            rules={[{ required: true, message: 'Введите имя пользователя...' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            placeholder="Пароль"
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Введите пароль...' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Войти
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Add Stream Modal */}
                <Modal
                    title="Добавить видео"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Form
                        name="addStream"
                        onFinish={handleAddStream}
                        layout="vertical"
                    >
                        <Form.Item
                            placeholder="Название видео"
                            label="Название вашего видео"
                            name="name"
                            rules={[{required: true, message: 'Введите название видео'}]}
                        >
                            <Input
                                value={newStream.name}
                                onChange={(e) => setNewStream({...newStream, name: e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Описание видео"
                            name="description"
                        >
                            <Input
                                value={newStream.description}
                                onChange={(e) => setNewStream({...newStream, description: e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item
                            placeholder="Ссылка на заставку"
                            label="Ссылка на заставку"
                            name="preview"
                        >
                            <Input
                                value={newStream.preview}
                                onChange={(e) => setNewStream({...newStream, preview: e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item
                            placeholder="Ссылка на видео"
                            label="Ссылка на видео"
                            name="link"
                        >
                            <Input
                                value={newStream.link}
                                onChange={(e) => setNewStream({...newStream, link: e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Добавить
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default App;
