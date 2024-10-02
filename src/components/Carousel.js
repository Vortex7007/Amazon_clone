// import { useState } from 'react'


// export default function Carousel() {
//     const images = [
//         `${process.env.PUBLIC_URL}/carousel1.jpg`,
//         `${process.env.PUBLIC_URL}/carousel2.jpg`,
//         `${process.env.PUBLIC_URL}/carousel3.jpg`
//     ];

//     const [currentSlide, setCurrentSlide] = useState(0);
//     const handleSlideChange = (index) => {
//         setCurrentSlide(index);
//     };

//     return (
//         <div className=''>
//             {/* images */}
//             <div className='flex'>
//                 {images.map((images, index) => (
//                     <div key={index} className={`inset-0 transition-all duration-700 ease-in-out transform ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
//                         <img src={images} alt={`slide ${index + 1}`} />
//                     </div>
//                 ))}
//             </div>

//             {/* Radios */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                 {images.map((_, index) => (
//                     <label key={index} className="relative">
//                         <input
//                             type="radio"
//                             name="carousel-indicators"
//                             checked={index === currentSlide}
//                             onChange={() => handleSlideChange(index)}
//                             className="sr-only"
//                         />
//                         <div
//                             className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-colors duration-300 ${index === currentSlide ? 'bg-black border-white' : 'bg-transparent border-black'
//                                 }`}
//                         />
//                     </label>
//                 ))}
//             </div>
//         </div>
//     )
// }

// import { useState } from 'react';

// const Carousel = () => {
//   const images = [
//     'https://via.placeholder.com/800x400?text=Slide+1',
//     'https://via.placeholder.com/800x400?text=Slide+2',
//     'https://via.placeholder.com/800x400?text=Slide+3',
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleSlideChange = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="relative w-full max-w-lg mx-auto">
//       {/* Images */}
//       <div className="relative overflow-hidden">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
//               index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
//             }`}
//           >
//             <img
//               src={image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-48 sm:h-64 object-cover"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Radio Buttons */}
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//         {images.map((_, index) => (
//           <label key={index} className="relative">
//             <input
//               type="radio"
//               name="carousel-indicators"
//               checked={index === currentSlide}
//               onChange={() => handleSlideChange(index)}
//               className="sr-only"
//             />
//             <div
//               className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-colors duration-300 ${
//                 index === currentSlide ? 'bg-white border-white' : 'bg-transparent border-white'
//               }`}
//             />
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Carousel;

// attempt 3
// import { useState } from 'react'

// export default function Carousel() {
//     const images = [
//         `${process.env.PUBLIC_URL}/carousel1.jpg`,
//         `${process.env.PUBLIC_URL}/carousel2.jpg`,
//         `${process.env.PUBLIC_URL}/carousel3.jpg`
//     ];

//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [slideDirection, setSlideDirection] = useState("right"); // New state to track slide direction

//     const handleSlideChange = (index) => {
//         // Determine direction of slide based on the new index
//         if (index > currentSlide) {
//             setSlideDirection("right"); // Slide from right to left
//         } else {
//             setSlideDirection("left"); // Slide from left to right
//         }
//         setCurrentSlide(index);
//     };

//     return (
//         <div className='relative w-full h-full overflow-hidden'>
//             {/* Images */}
//             <div className='flex w-full h-64 md:h-96 overflow-hidden relative'>
//                 {images.map((image, index) => (
//                     <div
//                         key={index}
//                         className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out transform ${
//                             index === currentSlide
//                                 ? 'translate-x-0 opacity-100'
//                                 : slideDirection === "right"
//                                 ? index < currentSlide
//                                     ? '-translate-x-full opacity-0'
//                                     : 'translate-x-full opacity-0'
//                                 : index > currentSlide
//                                 ? 'translate-x-full opacity-0'
//                                 : '-translate-x-full opacity-0'
//                         }`}
//                     >
//                         <img src={image} alt={`slide ${index + 1}`} className="w-full h-full object-cover" />
//                     </div>
//                 ))}
//             </div>

//             {/* Radios */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                 {images.map((_, index) => (
//                     <label key={index} className="relative">
//                         <input
//                             type="radio"
//                             name="carousel-indicators"
//                             checked={index === currentSlide}
//                             onChange={() => handleSlideChange(index)}
//                             className="sr-only"
//                         />
//                         <div
//                             className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-colors duration-300 ${
//                                 index === currentSlide ? 'bg-black border-white' : 'bg-transparent border-black'
//                             }`}
//                         />
//                     </label>
//                 ))}
//             </div>
//         </div>
//     );
// }
// attempt 4
import { useState } from 'react'

export default function Carousel() {
    const images = [
        `${process.env.PUBLIC_URL}/carousel1.jpg`,
        `${process.env.PUBLIC_URL}/carousel2.jpg`,
        `${process.env.PUBLIC_URL}/carousel3.jpg`
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideDirection, setSlideDirection] = useState("right"); // Tracks slide direction
    const [touchStartX, setTouchStartX] = useState(0); // Touch start position

    // Handle manual slide change
    const handleSlideChange = (index) => {
        if (index > currentSlide) {
            setSlideDirection("right");
        } else {
            setSlideDirection("left");
        }
        setCurrentSlide(index);
    };

    // Handle touch start (finger down)
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX); // Store the starting X coordinate of the touch
    };

    // Handle touch end (finger up)
    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX; // Get the X coordinate where the touch ended
        const touchDifference = touchEndX - touchStartX;

        // Swipe left (next slide)
        if (touchDifference < -50) {
            handleNextSlide();
        }
        // Swipe right (previous slide)
        if (touchDifference > 50) {
            handlePreviousSlide();
        }
    };

    // Move to the next slide
    const handleNextSlide = () => {
        if (currentSlide < images.length - 1) {
            setSlideDirection("right");
            setCurrentSlide(currentSlide + 1);
        } else {
            // Loop back to the first slide
            setSlideDirection("right");
            setCurrentSlide(0);
        }
    };

    // Move to the previous slide
    const handlePreviousSlide = () => {
        if (currentSlide > 0) {
            setSlideDirection("left");
            setCurrentSlide(currentSlide - 1);
        } else {
            // Loop to the last slide
            setSlideDirection("left");
            setCurrentSlide(images.length - 1);
        }
    };

    return (
        <div className='relative w-full h-full overflow-hidden'>
            {/* Images */}
            <div
                className='flex w-full h-64 md:h-96 overflow-hidden relative'
                onTouchStart={handleTouchStart} // Listen for touch start event
                onTouchEnd={handleTouchEnd}     // Listen for touch end event
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out transform ${
                            index === currentSlide
                                ? 'translate-x-0 opacity-100'
                                : slideDirection === "right"
                                ? index < currentSlide
                                    ? '-translate-x-full opacity-0'
                                    : 'translate-x-full opacity-0'
                                : index > currentSlide
                                ? 'translate-x-full opacity-0'
                                : '-translate-x-full opacity-0'
                        }`}
                    >
                        <img src={image} alt={`slide ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Radios */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <label key={index} className="relative">
                        <input
                            type="radio"
                            name="carousel-indicators"
                            checked={index === currentSlide}
                            onChange={() => handleSlideChange(index)}
                            className="sr-only"
                        />
                        <div
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-colors duration-300 ${
                                index === currentSlide ? 'bg-white border-white' : 'bg-transparent border-white'
                            }`}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
