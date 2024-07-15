import { useRef, useEffect } from 'react';

function ImageBlender({ imageSources }) {
  const canvasRef = useRef(null);
  const images = imageSources || [];
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    const loadImages = async (imagePaths) => {
      const promises = imagePaths.map(loadImage);
      return await Promise.all(promises);
    };

    const mergeImages = async () => {
      try {
        const loadedImages = await loadImages(images);

        ctx.drawImage(loadedImages[0], 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let mergedData = new Uint8ClampedArray(imageData.data);

        for (let i = 1; i < loadedImages.length; i++) {
          ctx.drawImage(loadedImages[i], 0, 0, canvas.width, canvas.height);
          let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let j = 0; j < mergedData.length; j += 4) {
            mergedData[j] = (mergedData[j] + imgData.data[j]) / 2; // Red
            mergedData[j + 1] = (mergedData[j + 1] + imgData.data[j + 1]) / 2; // Green
            mergedData[j + 2] = (mergedData[j + 2] + imgData.data[j + 2]) / 2; // Blue
          }
        }

        ctx.putImageData(new ImageData(mergedData, canvas.width, canvas.height), 0, 0);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    mergeImages();
  }, [images]);

  return (
    <div className="App">
      <canvas ref={canvasRef} className="w-36 h-36" />
    </div>
  );
}

export default ImageBlender;
