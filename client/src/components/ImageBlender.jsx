import { useRef, useEffect } from 'react';

function ImageBlender({ imageSources }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        const loadedImages = await loadImages(imageSources);
        if (loadedImages.length === 0) return;

        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = canvas.width;
        offScreenCanvas.height = canvas.height;
        const offScreenCtx = offScreenCanvas.getContext('2d');

        const imageDataArray = [];

        loadedImages.forEach((img, index) => {
          offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
          offScreenCtx.drawImage(img, 0, 0, offScreenCanvas.width, offScreenCanvas.height);
          imageDataArray[index] = offScreenCtx.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height).data;
        });

        let mergedData = new Uint8ClampedArray(imageDataArray[0].length).fill(255);
        let count = new Uint8ClampedArray(imageDataArray[0].length / 4).fill(0);

        for (let i = 0; i < imageDataArray.length; i++) {
          for (let j = 0; j < mergedData.length; j += 4) {
            if (imageDataArray[i][j + 3] > 0) {
              count[j / 4]++;
              if (count[j / 4] === 1) {
                mergedData[j] = imageDataArray[i][j];
                mergedData[j + 1] = imageDataArray[i][j + 1];
                mergedData[j + 2] = imageDataArray[i][j + 2];
                mergedData[j + 3] = 255;
              }
            }
          }
        }

        for (let j = 0; j < mergedData.length; j += 4) {
          let sumR = 0, sumG = 0, sumB = 0;
          let overlapCount = 0;

          for (let i = 0; i < imageDataArray.length; i++) {
            if (imageDataArray[i][j + 3] > 0) {
              sumR += imageDataArray[i][j];
              sumG += imageDataArray[i][j + 1];
              sumB += imageDataArray[i][j + 2];
              overlapCount++;
            }
          }

          if (overlapCount > 1) {
            mergedData[j] = sumR / overlapCount;
            mergedData[j + 1] = sumG / overlapCount;
            mergedData[j + 2] = sumB / overlapCount;
            mergedData[j + 3] = 255;
          }
        }

        ctx.putImageData(new ImageData(mergedData, canvas.width, canvas.height), 0, 0);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    mergeImages();
  }, [imageSources]);
  return (
    <div className="App">
      <canvas ref={canvasRef} className="w-36 h-36 rounded-full " />
    </div>
  );
}

export default ImageBlender;
