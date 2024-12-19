// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag } from 'antd';
import StreamModal from './StreamModal';

const { Meta } = Card;

// eslint-disable-next-line react/prop-types
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
                    height: '40%', // Фиксированная высота для карточки
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
                onClick={showModal}
            >
                {/* Обертка для изображения с фиксированной высотой */}
                <div style={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        alt="Плейсхолдер заставки видео"
                        src={stream.preview || "https://99px.ru/sstorage/53/2024/11/mid_364005_906745.jpg"}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain' // Изменено на 'contain'
                        }}
                    />
                </div>

                {/* Текстовая информация и имя автора */}
                <div style={{ padding: '10px', textAlign: 'left' }}>
                    <Meta
                        title={stream.name || "Название видео не указано"}
                        description={stream.description || "Описание видео не указано"}
                    />
                    <div style={{ marginTop: 8 }}>
                        <Tag color="blue">{stream.owner_name || "Владелец видео не указан"}</Tag>
                    </div>
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
