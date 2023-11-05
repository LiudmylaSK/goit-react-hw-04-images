import React, { useEffect, useCallback } from 'react';
import css from './Modal.module.css';

export const Modal = ({ image, onCloseModal }) => {
  const onKeyDown = useCallback((event) => {
    if (event.code === 'Escape') {
      onCloseModal();
    }
  }, [onCloseModal]);

  const onOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onKeyDown]);

  return (
    <div className={css.overlay} onClick={onOverlayClick}>
      <div className={css.modal}>
        <img className={css.largeImage} src={image.largeImageURL} alt={image.tags} />
      </div>
    </div>
  );
};


// import React, { useEffect } from 'react';
// import css from './Modal.module.css';

// export const Modal = ({ image, onCloseModal }) => {
//   const onKeyDown = (event) => {
//     if (event.code === 'Escape') {
//       onCloseModal();
//     }
//   };

//   const onOverlayClick = (event) => {
//     if (event.target === event.currentTarget) {
//       onCloseModal();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('keydown', onKeyDown);
//     document.body.style.overflow = 'hidden';

//     return () => {
//       document.removeEventListener('keydown', onKeyDown);
//       document.body.style.overflow = 'auto';
//     };
//   }, []); 

//   return (
//     <div className={css.overlay} onClick={onOverlayClick}>
//       <div className={css.modal}>
//         <img className={css.largeImage} src={image.largeImageURL} alt={image.tags} />
//       </div>
//     </div>
//   );
// };