import React, { useState, useEffect } from "react";
import { fetchImages } from "image-api/Api";
import { Searchbar } from './Searchbar/Searchbar'
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  borderRadius: '10px',
  position: 'left-top',
  width: '300px',
  timeout: 4000,
  clickToClose: true,
  cssAnimationStyle: 'zoom',
  info: {
    background: '#f2e230',
    textColor: '#00f'
  },
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  const fetchAllImages = async () => {
    try {
      setIsLoading(true);
      if (!query) return;

      const fetchedImages = await fetchImages(query, page);
      const pagesCount = Math.ceil(fetchedImages.totalHits / 12);

      setTotalPages(pagesCount);
      setImages(prevImages => (page === 1 ? fetchedImages.hits : [...prevImages, ...fetchedImages.hits]));
      setLoadMore(page < pagesCount);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const onLoadMore = () => {
    setIsLoading(true);
    setPage(prevPage => prevPage + 1);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const search = event.currentTarget.elements.search.value;
    if (!search.trim()) {
      Notify.info('Please enter a search query');
    } else {
      try {
        setQuery(search);
        setPage(1);
        setIsLoading(true);
        const fetchedImages = await fetchImages(search, 1);
        const pagesCount = Math.ceil(fetchedImages.totalHits / 12);

        if (fetchedImages.totalHits === 0) {
          Notify.info('No images found for your query');
        } else {
          setTotalPages(pagesCount);
          setImages(fetchedImages.hits);
          setLoadMore(1 < pagesCount);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }
  };

  const openModal = selectedImage => {
    setActiveImage(selectedImage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setActiveImage(null);
    setIsModalOpen(false);
  };


   useEffect(() => {
    if (query || page > 1) {
      fetchAllImages();
    }
  }, [page, query]);

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {query && (
        <>
          <ImageGallery images={images} onImageClick={openModal} />
          {loadMore && <Button onLoadMore={onLoadMore} />}
        </>
      )}
      {isModalOpen && (
        <Modal image={activeImage} onCloseModal={closeModal} />
      )}
    </div>
  );
};
