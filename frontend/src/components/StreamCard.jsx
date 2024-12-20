// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import StreamModal from './StreamModal';

const { Meta } = Card;

function StreamCard({ stream, onStreamUpdated, onStreamDeleted }) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="flex items-center">
            <Card
                hoverable
                style={{
                    width: '80%',
                    height: 'auto', // Высота подстраивается под содержимое
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative', // Для позиционирования имени автора
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Черная обводка (dropshadow)
                    borderRadius: '10px', // Добавлен небольшой радиус для скругления углов
                    overflow: 'hidden', // Убираем выходящий контент
                }}
                onClick={showModal}
            >
                {/* Название сверху */}
                <div style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold', fontSize: '18px' }}>
                    {stream.name || "Название видео не указано"}
                </div>

                {/* Картинка */}
                <div style={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        alt="Плейсхолдер заставки видео"
                        src={stream.preview || "https://99px.ru/sstorage/53/2024/11/mid_364005_906745.jpg"}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {/* Описание */}
                <div style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>
                    {stream.description || "Описание видео не указано"}
                </div>

                {/* Имя автора внизу справа */}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '12px', color: 'gray' }}>
                    {stream.owner_name || "Автор не указан"}
                </div>
            </Card>

            {/* Модальное окно для отображения видео */}
            {isModalVisible && (
                <StreamModal
                    stream={stream}
                    isVisible={isModalVisible}
                    onClose={handleClose}
                    onStreamUpdated={onStreamUpdated}
                    onStreamDeleted={onStreamDeleted}
                />
            )}
        </div>
    );
}

StreamCard.propTypes = {
    stream: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        preview: PropTypes.string,
        link: PropTypes.string,
        owner_name: PropTypes.string, // Поле автора
    }).isRequired,
};

export default StreamCard;
